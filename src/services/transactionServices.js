import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db, auth, isFirebaseAuthAvailable } from '../firebase.config';

// Mock transactions for development
const mockTransactions = [];

// Transaction types
export const TRANSACTION_TYPES = {
  BUY: 'buy',
  SELL: 'sell'
};

// Asset types
export const ASSET_TYPES = {
  STOCK: 'stock',
  MUTUAL_FUND: 'mf',
  CRYPTO: 'crypto',
  BOND: 'bond'
};

const transactionService = {
  // Record a new transaction
  recordTransaction: async (transactionData) => {
    try {
      if (!isFirebaseAuthAvailable) {
        console.log("Using mock transaction service (Firebase not available)");
        const mockTransaction = {
          id: `mock_transaction_${Date.now()}`,
          userId: 'mock_user',
          ...transactionData,
          timestamp: new Date().toISOString()
        };
        mockTransactions.push(mockTransaction);
        return mockTransaction;
      }

      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      // Structure the transaction data
      const transaction = {
        userId: user.uid,
        assetId: transactionData.assetId,
        assetName: transactionData.assetName,
        assetSymbol: transactionData.assetSymbol,
        assetType: transactionData.assetType,
        transactionType: transactionData.transactionType,
        quantity: transactionData.quantity,
        amount: transactionData.amount,
        price: transactionData.price,
        timestamp: serverTimestamp(),
        platform: transactionData.platform || 'default',
        notes: transactionData.notes || '',
        status: transactionData.status || 'completed',
        fees: transactionData.fees || 0
      };

      // Add transaction to Firestore
      const transactionRef = collection(db, 'transactions');
      const docRef = await addDoc(transactionRef, transaction);
      
      return {
        id: docRef.id,
        ...transaction
      };
    } catch (error) {
      console.error('Failed to record transaction:', error);
      throw error;
    }
  },

  // Get user's transaction history
  getUserTransactions: async (options = {}) => {
    try {
      if (!isFirebaseAuthAvailable) {
        console.log("Using mock transaction service (Firebase not available)");
        return mockTransactions;
      }

      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      // Build query based on options
      const transactionsRef = collection(db, 'transactions');
      let transactionQuery = query(
        transactionsRef, 
        where('userId', '==', user.uid)
      );

      // Add filters if provided
      if (options.assetType) {
        transactionQuery = query(transactionQuery, where('assetType', '==', options.assetType));
      }
      
      if (options.transactionType) {
        transactionQuery = query(transactionQuery, where('transactionType', '==', options.transactionType));
      }

      // Add ordering - default to most recent first
      transactionQuery = query(transactionQuery, orderBy('timestamp', 'desc'));

      // Add limit if provided
      if (options.limit) {
        transactionQuery = query(transactionQuery, limit(options.limit));
      }

      // Execute query
      const querySnapshot = await getDocs(transactionQuery);
      
      // Extract data
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamp to ISO string for consistency
          timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().toISOString() : new Date().toISOString()
        });
      });

      return transactions;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  },

  // Get a single transaction by ID
  getTransactionById: async (transactionId) => {
    try {
      if (!isFirebaseAuthAvailable) {
        console.log("Using mock transaction service (Firebase not available)");
        const mockTransaction = mockTransactions.find(tx => tx.id === transactionId);
        if (!mockTransaction) {
          throw new Error('Transaction not found');
        }
        return mockTransaction;
      }

      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      // Get transaction document
      const transactionDoc = await getDoc(doc(db, 'transactions', transactionId));
      
      if (!transactionDoc.exists()) {
        throw new Error('Transaction not found');
      }

      const transactionData = transactionDoc.data();
      
      // Verify the transaction belongs to the current user
      if (transactionData.userId !== user.uid) {
        throw new Error('Unauthorized access to transaction');
      }

      return {
        id: transactionDoc.id,
        ...transactionData,
        // Convert Firestore Timestamp to ISO string for consistency
        timestamp: transactionData.timestamp ? transactionData.timestamp.toDate().toISOString() : null
      };
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
      throw error;
    }
  },

  // Get transaction statistics
  getTransactionStats: async () => {
    try {
      if (!isFirebaseAuthAvailable) {
        console.log("Using mock transaction service (Firebase not available)");
        
        // Calculate basic stats from mock data
        const totalBuy = mockTransactions
          .filter(tx => tx.transactionType === TRANSACTION_TYPES.BUY)
          .reduce((sum, tx) => sum + tx.amount, 0);
          
        const totalSell = mockTransactions
          .filter(tx => tx.transactionType === TRANSACTION_TYPES.SELL)
          .reduce((sum, tx) => sum + tx.amount, 0);
          
        return {
          totalTransactions: mockTransactions.length,
          totalBuyAmount: totalBuy,
          totalSellAmount: totalSell,
          netInvestment: totalBuy - totalSell
        };
      }

      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      // Get all user transactions
      const transactions = await this.getUserTransactions();
      
      // Calculate statistics
      const buyTransactions = transactions.filter(tx => tx.transactionType === TRANSACTION_TYPES.BUY);
      const sellTransactions = transactions.filter(tx => tx.transactionType === TRANSACTION_TYPES.SELL);
      
      const totalBuyAmount = buyTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const totalSellAmount = sellTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      
      return {
        totalTransactions: transactions.length,
        totalBuyAmount,
        totalSellAmount,
        netInvestment: totalBuyAmount - totalSellAmount
      };
    } catch (error) {
      console.error('Failed to get transaction statistics:', error);
      throw error;
    }
  }
};

export default transactionService; 
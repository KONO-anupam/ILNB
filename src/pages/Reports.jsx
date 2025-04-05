import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/common/Card';
import { ArrowUp, ArrowDown, AlertTriangle, BarChart2, LineChart, PieChart, Calendar } from 'lucide-react';
import React from 'react';
import transactionService from '../services/transactionServices';

function Reports() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('performance');
  const { isDarkMode } = useTheme();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [transactionError, setTransactionError] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoadingTransactions(true);
      setTransactionError(null);
      
      try {
        const transactions = await transactionService.getUserTransactions({ limit: 10 });
        setRecentTransactions(transactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setTransactionError('Failed to load transaction history. Please try again later.');
      } finally {
        setIsLoadingTransactions(false);
      }
    };
    
    fetchTransactions();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Sample data for demonstration
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [12000, 15000, 14000, 16500, 17500, 16000, 18000, 20000, 19000, 22000, 24000, 25000]
  };

  const assetAllocation = [
    { category: 'Stocks', percentage: 45, color: 'blue' },
    { category: 'Mutual Funds', percentage: 30, color: 'green' },
    { category: 'Bonds', percentage: 15, color: 'purple' },
    { category: 'Crypto', percentage: 5, color: 'orange' },
    { category: 'Commodities', percentage: 5, color: 'red' },
  ];

  const alerts = [
    { id: 1, type: 'info', message: 'Market volatility expected due to upcoming Fed announcements.' },
    { id: 2, type: 'warning', message: 'Your allocation to tech stocks is above your target range.' },
    { id: 3, type: 'success', message: 'Your mutual fund investments have outperformed the market by 3.2%.' }
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex overflow-x-auto mb-6 pb-2 hide-scrollbar">
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-2 rounded-lg mr-2 flex items-center whitespace-nowrap ${
                activeTab === 'performance'
                  ? isDarkMode
                    ? 'bg-purple-900/30 text-purple-300'
                    : 'bg-purple-100 text-purple-800'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <LineChart className="w-4 h-4 mr-2" />
              <span>Performance</span>
            </button>
            
            <button
              onClick={() => setActiveTab('allocation')}
              className={`px-4 py-2 rounded-lg mr-2 flex items-center whitespace-nowrap ${
                activeTab === 'allocation'
                  ? isDarkMode
                    ? 'bg-purple-900/30 text-purple-300'
                    : 'bg-purple-100 text-purple-800'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <PieChart className="w-4 h-4 mr-2" />
              <span>Asset Allocation</span>
            </button>
            
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-lg mr-2 flex items-center whitespace-nowrap ${
                activeTab === 'transactions'
                  ? isDarkMode
                    ? 'bg-purple-900/30 text-purple-300'
                    : 'bg-purple-100 text-purple-800'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              <span>Transactions</span>
            </button>
            
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded-lg mr-2 flex items-center whitespace-nowrap ${
                activeTab === 'calendar'
                  ? isDarkMode
                    ? 'bg-purple-900/30 text-purple-300'
                    : 'bg-purple-100 text-purple-800'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>Calendar</span>
            </button>
          </div>

          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="glass-effect p-6">
                  <h3 className="text-xl font-semibold mb-4">Portfolio Performance</h3>
                  <div className="relative h-64">
                    <div className="flex flex-col absolute left-0 top-0 h-full justify-between text-xs text-gray-500">
                      <span>₹30,000</span>
                      <span>₹25,000</span>
                      <span>₹20,000</span>
                      <span>₹15,000</span>
                      <span>₹10,000</span>
                      <span>₹5,000</span>
                      <span>₹0</span>
                    </div>
                    <div className="ml-14 h-full flex items-end">
                      {chartData.values.map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full max-w-[30px] rounded-t-sm bg-gradient-to-t from-purple-500 to-blue-500"
                            style={{ height: `${(value / 30000) * 100}%` }}
                          ></div>
                          <span className="text-xs mt-1 text-gray-500">{chartData.labels[index]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
              
              <div>
                <Card className="glass-effect p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">Investment Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Invested</span>
                        <span className="font-medium">₹200,000</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current Value</span>
                        <span className="font-medium">₹250,000</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '125%' }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-2 mt-2 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Return</span>
                        <div className="flex items-center text-green-500">
                          <ArrowUp className="w-4 h-4 mr-1" />
                          <span className="font-medium">₹50,000 (25%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="glass-effect p-6">
                  <h3 className="text-xl font-semibold mb-4">Alerts</h3>
                  <div className="space-y-3">
                    {alerts.map(alert => (
                      <div key={alert.id} className={`p-3 rounded-lg flex items-start ${
                        alert.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                        alert.type === 'info' ? 'bg-blue-500/10 border border-blue-500/20' :
                        'bg-green-500/10 border border-green-500/20'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 mr-2 flex-shrink-0 ${
                          alert.type === 'warning' ? 'text-yellow-500' :
                          alert.type === 'info' ? 'text-blue-500' :
                          'text-green-500'
                        }`} />
                        <span className="text-sm">{alert.message}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'allocation' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="glass-effect p-6">
                  <h3 className="text-xl font-semibold mb-4">Asset Allocation</h3>
                  <div className="flex">
                    <div className="w-64 h-64 relative mx-auto">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {assetAllocation.reduce((elements, asset, index) => {
                          const previousTotal = index === 0 ? 0 : 
                            assetAllocation.slice(0, index).reduce((sum, a) => sum + a.percentage, 0);
                          const startAngle = (previousTotal / 100) * 360;
                          const endAngle = ((previousTotal + asset.percentage) / 100) * 360;
                          
                          const x1 = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
                          const y1 = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
                          const x2 = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
                          const y2 = 50 + 40 * Math.sin(Math.PI * endAngle / 180);
                          
                          const largeArcFlag = asset.percentage > 50 ? 1 : 0;
                          
                          elements.push(
                            <path 
                              key={asset.category}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill={`var(--color-${asset.color}-500)`}
                              className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                          );
                          
                          return elements;
                        }, [])}
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mt-6">
                    {assetAllocation.map(asset => (
                      <div key={asset.category} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-${asset.color}-500 flex-shrink-0`}></div>
                        <div className="text-sm">
                          <span className="text-gray-400">{asset.category}:</span>
                          <span className="ml-1 font-medium">{asset.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              
              <div>
                <Card className="glass-effect p-6">
                  <h3 className="text-xl font-semibold mb-4">Asset Breakdown</h3>
                  <div className="space-y-4">
                    {assetAllocation.map(asset => (
                      <div key={asset.category}>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{asset.category}</span>
                          <span className="font-medium">{asset.percentage}%</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`bg-${asset.color}-500 h-full rounded-full`} 
                            style={{ width: `${asset.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <Card className="glass-effect p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
              {transactionError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4">
                  {transactionError}
                </div>
              )}
              
              {isLoadingTransactions ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="py-3 text-left text-xs font-medium uppercase tracking-wider">Asset</th>
                        <th className="py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                        <th className="py-3 text-right text-xs font-medium uppercase tracking-wider">Quantity</th>
                        <th className="py-3 text-right text-xs font-medium uppercase tracking-wider">Amount</th>
                        <th className="py-3 text-right text-xs font-medium uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((tx, index) => (
                        <tr 
                          key={tx.id} 
                          className="border-b border-gray-700 last:border-0 hover:bg-white/5 transition-colors cursor-pointer animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <td className="py-4">{tx.assetName || 'Unknown Asset'}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tx.transactionType === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {tx.transactionType.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 text-right">{tx.quantity}</td>
                          <td className="py-4 text-right">{formatCurrency(tx.amount)}</td>
                          <td className="py-4 text-right">{formatDate(tx.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400">No transaction history found.</p>
                  <p className="text-gray-400 mt-2">Your transactions will appear here after you buy or sell assets.</p>
                </div>
              )}
              
              {recentTransactions.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <button className="px-4 py-2 text-sm text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/10 transition-colors">
                    View All Transactions
                  </button>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'calendar' && (
            <Card className="glass-effect p-6">
              <h3 className="text-xl font-semibold mb-4">Investment Calendar</h3>
              <div className="text-center py-10">
                <p className="text-gray-400">Calendar view coming soon.</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default Reports; 
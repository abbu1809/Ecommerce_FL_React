/**
 * FIREBASE OPTIMIZATION TEST COMPONENT
 * 
 * This component tests the new backend gateway endpoints and compares
 * performance with the old direct Firebase calls
 */

import React, { useState, useEffect, useCallback } from 'react';
import optimizedApiService from '../services/optimizedApiService';

const FirebaseOptimizationValidator = () => {
  const [testResults, setTestResults] = useState({
    optimizationStatus: 'Testing...',
    dashboardTest: 'Not started',
    ordersTest: 'Not started',
    productsTest: 'Not started',
    usersTest: 'Not started',
    performanceComparison: null
  });

  const [isLoading, setIsLoading] = useState(false);

  // Test optimization status
  const testOptimizationStatus = async () => {
    try {
      const status = await optimizedApiService.utils.checkOptimizationStatus();
      return {
        success: status.active,
        message: status.active 
          ? `✅ Backend Gateway Active - ${status.readReduction} reduction` 
          : '❌ Backend Gateway Not Active',
        details: status
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Status Check Failed: ${error.message}`,
        details: null
      };
    }
  };

  // Test dashboard endpoint
  const testDashboardEndpoint = async () => {
    try {
      const startTime = Date.now();
      const result = await optimizedApiService.dashboard.getAggregatedData();
      const endTime = Date.now();
      
      return {
        success: result.status === 'success',
        message: `✅ Dashboard: ${result.data?.stats?.total_orders || 0} orders, ${endTime - startTime}ms`,
        details: {
          responseTime: endTime - startTime,
          optimization: result.optimization,
          dataSize: Object.keys(result.data || {}).length
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Dashboard Failed: ${error.message}`,
        details: null
      };
    }
  };

  // Test orders endpoint
  const testOrdersEndpoint = async () => {
    try {
      const startTime = Date.now();
      const result = await optimizedApiService.orders.getPaginated({ page: 1, pageSize: 10 });
      const endTime = Date.now();
      
      return {
        success: result.status === 'success',
        message: `✅ Orders: ${result.data?.orders?.length || 0} orders, ${endTime - startTime}ms`,
        details: {
          responseTime: endTime - startTime,
          optimization: result.optimization,
          pagination: result.data?.pagination
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Orders Failed: ${error.message}`,
        details: null
      };
    }
  };

  // Test products endpoint  
  const testProductsEndpoint = async () => {
    try {
      const startTime = Date.now();
      const result = await optimizedApiService.products.getPaginated({ page: 1, pageSize: 10 });
      const endTime = Date.now();
      
      return {
        success: result.status === 'success',
        message: `✅ Products: ${result.data?.products?.length || 0} products, ${endTime - startTime}ms`,
        details: {
          responseTime: endTime - startTime,
          optimization: result.optimization,
          pagination: result.data?.pagination
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Products Failed: ${error.message}`,
        details: null
      };
    }
  };

  // Test users endpoint
  const testUsersEndpoint = async () => {
    try {
      const startTime = Date.now();
      const result = await optimizedApiService.users.getPaginated({ page: 1, pageSize: 10 });
      const endTime = Date.now();
      
      return {
        success: result.status === 'success',
        message: `✅ Users: ${result.data?.users?.length || 0} users, ${endTime - startTime}ms`,
        details: {
          responseTime: endTime - startTime,
          optimization: result.optimization,
          pagination: result.data?.pagination
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Users Failed: ${error.message}`,
        details: null
      };
    }
  };

  // Run all tests
  const runAllTests = useCallback(async () => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Starting Firebase Optimization Validation...');
      
      // Test optimization status
      const statusResult = await testOptimizationStatus();
      setTestResults(prev => ({ ...prev, optimizationStatus: statusResult }));
      
      // Test dashboard endpoint
      const dashboardResult = await testDashboardEndpoint();
      setTestResults(prev => ({ ...prev, dashboardTest: dashboardResult }));
      
      // Test orders endpoint  
      const ordersResult = await testOrdersEndpoint();
      setTestResults(prev => ({ ...prev, ordersTest: ordersResult }));
      
      // Test products endpoint
      const productsResult = await testProductsEndpoint();
      setTestResults(prev => ({ ...prev, productsTest: productsResult }));
      
      // Test users endpoint
      const usersResult = await testUsersEndpoint();
      setTestResults(prev => ({ ...prev, usersTest: usersResult }));
      
      // Calculate performance comparison
      const metrics = optimizedApiService.utils.getOptimizationMetrics();
      setTestResults(prev => ({ ...prev, performanceComparison: metrics }));
      
      console.log('✅ All optimization tests completed');
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-run tests on component mount
  useEffect(() => {
    runAllTests();
  }, [runAllTests]);

  const renderTestResult = (result, testName) => {
    if (typeof result === 'string') {
      return <div style={{ color: '#666' }}>{result}</div>;
    }
    
    return (
      <div style={{ 
        padding: '10px', 
        margin: '5px 0',
        border: `2px solid ${result.success ? '#10B981' : '#EF4444'}`,
        borderRadius: '8px',
        backgroundColor: result.success ? '#F0FDF4' : '#FEF2F2'
      }}>
        <div style={{ fontWeight: 'bold', color: result.success ? '#047857' : '#DC2626' }}>
          {testName}
        </div>
        <div style={{ fontSize: '14px', margin: '5px 0' }}>
          {result.message}
        </div>
        {result.details && (
          <details style={{ fontSize: '12px', color: '#666' }}>
            <summary>Details</summary>
            <pre>{JSON.stringify(result.details, null, 2)}</pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#1F2937', marginBottom: '20px' }}>
        🔥 Firebase Optimization Validation
      </h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runAllTests} 
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#9CA3AF' : '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? '🔄 Testing...' : '🚀 Run All Tests'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {renderTestResult(testResults.optimizationStatus, 'Optimization Status')}
        {renderTestResult(testResults.dashboardTest, 'Dashboard Endpoint')}
        {renderTestResult(testResults.ordersTest, 'Orders Endpoint')}
        {renderTestResult(testResults.productsTest, 'Products Endpoint')}
        {renderTestResult(testResults.usersTest, 'Users Endpoint')}
      </div>

      {testResults.performanceComparison && (
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#F3F4F6',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#1F2937', marginBottom: '15px' }}>
            📊 Performance Comparison
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={{ 
              padding: '15px',
              backgroundColor: '#FEF2F2',
              borderRadius: '8px',
              border: '2px solid #FCA5A5'
            }}>
              <h4 style={{ color: '#DC2626', margin: '0 0 10px 0' }}>Before (Direct Firebase)</h4>
              <div>📊 {testResults.performanceComparison.before.estimatedDailyReads} reads/day</div>
              <div>📈 {testResults.performanceComparison.before.quotaUsage} quota usage</div>
              <div>⚡ {testResults.performanceComparison.before.estimatedReadsPerSession} reads/session</div>
            </div>
            
            <div style={{ 
              padding: '15px',
              backgroundColor: '#F0FDF4',
              borderRadius: '8px',
              border: '2px solid #86EFAC'
            }}>
              <h4 style={{ color: '#047857', margin: '0 0 10px 0' }}>After (Backend Gateway)</h4>
              <div>📊 {testResults.performanceComparison.after.estimatedDailyReads} reads/day</div>
              <div>📈 {testResults.performanceComparison.after.quotaUsage} quota usage</div>
              <div>⚡ {testResults.performanceComparison.after.estimatedReadsPerSession} reads/session</div>
            </div>
            
            <div style={{ 
              padding: '15px',
              backgroundColor: '#EFF6FF',
              borderRadius: '8px',
              border: '2px solid #93C5FD'
            }}>
              <h4 style={{ color: '#1D4ED8', margin: '0 0 10px 0' }}>Improvement</h4>
              <div>🎯 {testResults.performanceComparison.improvement.readReduction} less reads</div>
              <div>📉 {testResults.performanceComparison.improvement.quotaReduction} quota reduction</div>
              <div>⏰ {testResults.performanceComparison.improvement.averageCacheTTL} cache TTL</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#FEF3C7',
        borderRadius: '8px',
        border: '2px solid #FBBF24'
      }}>
        <h4 style={{ color: '#92400E', margin: '0 0 10px 0' }}>📋 Next Steps</h4>
        <ul style={{ color: '#92400E', fontSize: '14px' }}>
          <li>✅ Backend Gateway Pattern implemented</li>
          <li>✅ Optimized endpoints with caching</li>
          <li>🔄 Migrate frontend components to use new API</li>
          <li>⭐ Replace direct Firebase calls in AdminOrders.jsx</li>
          <li>⭐ Update useOptimizedAdminStore to use API service</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseOptimizationValidator;

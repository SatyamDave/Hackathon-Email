import React from 'react';
import { useEmail } from '../contexts/EmailContext';

export default function AnalyticsDashboard() {
  const { emails } = useEmail();
  
  const totalEmails = emails.length;
  const unreadEmails = emails.filter(e => !e.isRead).length;
  const importantEmails = emails.filter(e => e.isImportant).length;
  const urgentEmails = emails.filter(e => e.urgency === 'high').length;
  
  const avgResponseTime = '2.3 hours';
  const emailsThisWeek = Math.floor(totalEmails * 0.7);
  const productivityScore = Math.floor((totalEmails - unreadEmails) / totalEmails * 100);

  return (
    <div className="p-6 bg-dark-surface rounded-lg shadow">
      <h2 className="text-xl font-semibold text-dark-text-primary mb-6">Email Analytics</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-muted p-4 rounded-lg">
          <div className="text-2xl font-bold text-dark-accent">{totalEmails}</div>
          <div className="text-sm text-dark-text-secondary">Total Emails</div>
        </div>
        <div className="bg-dark-muted p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-400">{unreadEmails}</div>
          <div className="text-sm text-dark-text-secondary">Unread</div>
        </div>
        <div className="bg-dark-muted p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">{importantEmails}</div>
          <div className="text-sm text-dark-text-secondary">Important</div>
        </div>
        <div className="bg-dark-muted p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{productivityScore}%</div>
          <div className="text-sm text-dark-text-secondary">Productivity</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Volume Chart */}
        <div className="bg-dark-muted p-4 rounded-lg">
          <h3 className="font-medium text-dark-text-primary mb-3">Email Volume (This Week)</h3>
          <div className="flex items-end space-x-2 h-32">
            {[12, 18, 15, 22, 19, 25, 20].map((value, index) => (
              <div key={index} className="flex-1 bg-dark-accent rounded-t" style={{ height: `${(value / 25) * 100}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-dark-text-secondary mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Response Time Chart */}
        <div className="bg-dark-muted p-4 rounded-lg">
          <h3 className="font-medium text-dark-text-primary mb-3">Response Time Distribution</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-text-secondary">Immediate</span>
              <div className="flex-1 mx-2 bg-dark-border rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <span className="text-sm text-dark-text-primary">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-text-secondary">Within 1 hour</span>
              <div className="flex-1 mx-2 bg-dark-border rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <span className="text-sm text-dark-text-primary">40%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-text-secondary">Within 24 hours</span>
              <div className="flex-1 mx-2 bg-dark-border rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <span className="text-sm text-dark-text-primary">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-text-secondary">Over 24 hours</span>
              <div className="flex-1 mx-2 bg-dark-border rounded-full h-2">
                <div className="bg-red-400 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
              <span className="text-sm text-dark-text-primary">5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-muted p-3 rounded-lg">
          <div className="text-sm text-dark-text-secondary">Avg Response Time</div>
          <div className="text-lg font-semibold text-dark-text-primary">{avgResponseTime}</div>
        </div>
        <div className="bg-dark-muted p-3 rounded-lg">
          <div className="text-sm text-dark-text-secondary">Emails This Week</div>
          <div className="text-lg font-semibold text-dark-text-primary">{emailsThisWeek}</div>
        </div>
        <div className="bg-dark-muted p-3 rounded-lg">
          <div className="text-sm text-dark-text-secondary">Urgent Emails</div>
          <div className="text-lg font-semibold text-red-400">{urgentEmails}</div>
        </div>
      </div>
    </div>
  );
} 
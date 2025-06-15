import React from 'react';
import { Stack, Text, Pivot, PivotItem } from '@fluentui/react';
import { DefaultInbox } from './inbox/DefaultInbox';
import { PriorityInbox } from './inbox/PriorityInbox';
import { CustomInbox } from './inbox/CustomInbox';
import { Mail, Star, Filter } from 'lucide-react';
import { LoginButton } from './LoginButton';

export const TaskPane: React.FC = () => {
  return (
    <Stack tokens={{ childrenGap: 15 }} styles={{ root: { padding: '24px', minWidth: 400, background: '#111', color: '#fff', borderRadius: 12 } }}>
      <div style={{ marginBottom: 12 }}>
        <LoginButton />
      </div>
      <Text variant="xLarge" styles={{ root: { fontWeight: 700, marginBottom: 8, color: '#fff' } }}>SmartInbox</Text>
      <div className="tab-bar" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          <button className="tab active" style={{ flex: 1 }}>
            <Mail size={18} style={{ marginRight: 4, color: '#22c55e' }} /> Default
          </button>
          <button className="tab" style={{ flex: 1 }}>
            <Star size={18} style={{ marginRight: 4, color: '#22c55e' }} /> Priority
          </button>
          <button className="tab" style={{ flex: 1 }}>
            <Filter size={18} style={{ marginRight: 4, color: '#22c55e' }} /> Custom
          </button>
        </div>
      </div>
      {/* Render inboxes based on selected tab (for now, always show DefaultInbox) */}
      <DefaultInbox />
    </Stack>
  );
}; 
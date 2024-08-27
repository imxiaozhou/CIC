import { IconType } from '@/components/Icons';

export interface MenuItem {
  label: string;
  key: string;
  icon?: IconType;
  children?: MenuItem[];
  hidden?: boolean;
  code?: string;
}

export const menus: MenuItem[] = [
  {
    label: 'Dashboard',
    key: '/dashboard',
    icon: 'AppstoreOutlined',
    code: 'FD-S-OTH-001'
  },
  {
    label: 'User Management',
    key: 'user-management',
    icon: 'UserOutlined',
    children: [
      {
        label: 'Maintain User Account',
        key: '/user-management/maintain-user-account',
        code: 'FD-S-USR-001',
        children: [
          {
            label: 'Add User',
            key: '/user-management/maintain-user-account/add-user',
            hidden: true
          },
          {
            label: 'User Account Profile',
            key: '/user-management/maintain-user-account/edit-user',
            hidden: true
          }
        ]
      },
      {
        label: 'Approve Account Creation',
        key: '/user-management/approve-account-creation',
        code: 'FD-S-USR-002',
        children: [
          {
            label: 'User Account Approval',
            key: '/user-management/approve-account-creation/details',
            hidden: true
          }
        ]
      },
      {
        label: 'Maintain User Role',
        key: '/user-management/maintain-user-role',
        code: 'FD-S-USR-004'
      },
      {
        label: 'Maintain User Certificate',
        key: '/user-management/maintain-user-certificate',
        code: 'FD-S-USR-005',
        children: [
          {
            label: 'Detail',
            key: '/user-management/maintain-user-certificate/detail',
            hidden: true,
            children: [
              {
                label: 'Certificate Details',
                key: '/user-management/maintain-user-certificate/detail/certificate-create',
                hidden: true
              },
              {
                label: 'Certificate Details',
                key: '/user-management/maintain-user-certificate/detail/certificate-detail',
                hidden: true
              }
            ]
          }
        ]
      },
      {
        label: 'Approve Certificate Enrollment',
        key: '/user-management/approve-certificate-enrolment',
        code: 'FD-S-USR-006',
        children: [
          {
            label: 'Approve User Certificate Page',
            key: '/user-management/approve-certificate-enrolment/certificate-page',
            hidden: true,
            children: [
              {
                label: 'Certificate Details',
                key: '/user-management/approve-certificate-enrolment/certificate-page/certificate-details',
                hidden: true
              }
            ]
          }
        ]
      },
      {
        label: 'Maintain User Delegation',
        key: '/user-management/maintain-user-delegation',
        code: 'FD-S-USR-007',
        children: [
          {
            label: 'User Delegation',
            key: '/user-management/maintain-user-delegation/detail',
            hidden: true
          }
        ]
      }
    ]
  },
  {
    label: 'Device Management',
    key: 'device-management',
    icon: 'MobileOutlined',
    children: [
      {
        label: 'Maintain Mobile Device',
        key: '/device-management/maintain-mobile-device',
        code: 'FD-S-DVM-001',
        children: [
          {
            label: 'Device Registration Information',
            key: '/device-management/maintain-mobile-device/details',
            hidden: true
          }
        ]
      },
      {
        label: 'Download Mobile Device Log',
        key: '/device-management/download-mobile-device-log',
        code: 'FD-S-DVM-002'
      }
    ]
  },
  {
    label: 'Reporting & Analytics',
    key: 'reporting-analytics',
    icon: 'PieChartOutlined',
    children: [
      {
        label: 'Maintain Containerisation & Container Orchestration',
        key: '/reporting-analytics/maintain-container-and-orchestration',
        code: 'FD-S-RPT-001'
      },
      {
        label: 'Maintain Virtual Machine',
        key: '/reporting-analytics/maintain-virtual-machine',
        code: 'FD-S-RPT-002'
      },
      {
        label: 'Enquire the status of the message queue(s)',
        key: '/reporting-analytics/enquire-message-queue-status',
        code: 'FD-S-RPT-003'
      },
      {
        label: 'Enquire Concurrent User Logon',
        key: '/reporting-analytics/enquire-concurrent-user-logon',
        code: 'FD-S-RPT-004'
      }
    ]
  },
  {
    label: 'Message Management',
    key: 'message-management',
    icon: 'MailOutlined',
    children: [
      {
        label: 'Enquire and Manage Message',
        key: '/message-management/enquire-and-manage-message',
        code: 'FD-S-MSG-001'
      },
      {
        label: 'Enquire Message Usage Statistics',
        key: '/message-management/enquire-message-usage-statistics',
        code: 'FD-S-MSG-002',
        children: [
          {
            label: 'Message Usage Detail',
            key: '/message-management/enquire-message-usage-statistics/detail',
            hidden: true
          }
        ]
      }
    ]
  },
  {
    label: 'Audit Trials, Logs & Report Management',
    key: 'audit-trials-logs-report-management',
    icon: 'BarChartOutlined',
    children: [
      {
        label: 'Enquire Audit Logs for the events',
        key: '/audit-trials-logs-report-management/enquire-audit-logs',
        code: 'FD-S-AUD-001',
        children: [
          {
            label: 'Audit Log List Details',
            key: '/audit-trials-logs-report-management/enquire-audit-logs/details',
            hidden: true
          }
        ]
      },
      {
        label: 'Enquire Access Logs',
        key: '/audit-trials-logs-report-management/enquire-access-logs',
        code: 'FD-S-AUD-002'
      },
      {
        label: 'Enquire Log for Different Processes, Services and Activities',
        key: '/audit-trials-logs-report-management/enquire-logs',
        code: 'FD-S-AUD-003'
      },
      {
        label: 'List of Users Report',
        key: '/audit-trials-logs-report-management/list-of-users-report',
        code: 'FD-S-AUD-004'
      },
      {
        label: 'Summary of Message Traffic',
        key: '/audit-trials-logs-report-management/summary-of-message-traffic',
        code: 'FD-S-AUD-005'
      },
      {
        label: 'Message Operation Report',
        key: '/audit-trials-logs-report-management/message-operation-report',
        code: 'FD-S-AUD-006'
      }
    ]
  },
  {
    label: 'Notification Management',
    key: 'notification-management',
    icon: 'BellOutlined',
    children: [
      {
        label: 'Enquire Notification History',
        key: '/notification-management/enquire-notification-history',
        code: 'FD-S-NTM-001'
      },
      {
        label: 'Maintain Notification Templates',
        key: '/notification-management/maintain-notification-templates',
        code: 'FD-S-NTM-002',
        children: [
          {
            label: 'Edit Notification Template',
            key: '/notification-management/maintain-notification-templates/edit-notification-template',
            hidden: true
          }
        ]
      },
      {
        label: 'Send Ad-Hoc Notification',
        key: '/notification-management/send-ad-hoc-notification',
        code: 'FD-S-NTM-003',
        children: [
          {
            label: 'Device Registration Information',
            key: '/notification-management/send-ad-hoc-notification/details',
            hidden: true
          }
        ]
      },
      {
        label: 'Opt-in/Opt-out Notification',
        key: '/notification-management/opt-in-out-notification',
        code: 'FD-S-NTM-004',
        children: [
          {
            label: 'Edit Device Opt-in',
            key: '/notification-management/opt-in-out-notification/edit-device-opt-in',
            hidden: true
          }
        ]
      }
    ]
  },
  {
    label: 'System Configurations',
    key: 'system-configurations',
    icon: 'DatabaseOutlined',
    children: [
      {
        label: 'Maintain UI Default Setting',
        key: '/system-configurations/maintain-ui-default-setting',
        code: 'FD-S-SYS-001',
        children: [
          {
            label: 'Maintain UI Default Setting Edit',
            key: '/system-configurations/maintain-ui-default-setting/maintain-ui-default-setting-edit',
            hidden: true
          }
        ]
      },
      {
        label: 'Maintain User Setting of Mailbox Storage Quota',
        key: '/system-configurations/maintain-user-total-message',
        code: 'FD-S-SYS-002',
        children: [
          {
            label: 'Adjust Message Storage Quota',
            key: '/system-configurations/maintain-user-total-message/adjust-message-storage-quota',
            hidden: true
          }
        ]
      },
      {
        label: 'Maintain Group Setting of Mailbox Storage Quota',
        key: '/system-configurations/maintain-group-total-message',
        code: 'FD-S-SYS-003',
        children: [
          {
            label: 'Adjust Message Storage Quota',
            key: '/system-configurations/maintain-group-total-message/adjust-message-storage-quota',
            hidden: true
          }
        ]
      },
      {
        label: 'Maintain Organisation Setting of Mailbox Storage Quota',
        key: '/system-configurations/maintain-organisation-total-message',
        code: 'FD-S-SYS-004',
        children: [
          {
            label: 'Adjust Message Storage Quota',
            key: '/system-configurations/maintain-organisation-total-message/adjust-message-storage-quota',
            hidden: true
          }
        ]
      },
      {
        label: 'Maintain Global Parameters',
        key: '/system-configurations/maintain-global-parameters',
        code: 'FD-S-SYS-005'
      },
      {
        label: 'Maintain IP Whitelist',
        key: '/system-configurations/maintain-ip-whitelist',
        code: 'FD-S-SYS-006'
      },
      {
        label: 'Maintain Message Parameters',
        key: '/system-configurations/maintain-message-parameters',
        code: 'FD-S-SYS-007',
        children: [
          {
            label: 'Adjust Message Parameters',
            key: '/system-configurations/maintain-message-parameters/adjust-message-parameters',
            hidden: true
          }
        ]
      },
      {
        label: 'Maintain Schedule Job',
        key: '/system-configurations/maintain-schedule-job',
        code: 'FD-S-SYS-008'
      },
      {
        label: 'Enquire Job History',
        key: '/system-configurations/enquire-job-history',
        code: 'FD-S-SYS-009'
      }
    ]
  }
  // {
  //   label: 'Other Functions',
  //   key: 'other-functions',
  //   icon: 'BulbOutlined',
  //   children: [
  //     {
  //       label: 'FAQs',
  //       key: '/other-functions/FAQs'
  //     },
  //     {
  //       label: 'Change Password',
  //       key: '/other-functions/change-password'
  //     }
  //   ]
  // }
];

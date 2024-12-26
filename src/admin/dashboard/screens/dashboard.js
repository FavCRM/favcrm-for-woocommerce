import React from 'react';
import classNames from 'classnames';
import apiFetch from '@wordpress/api-fetch';
import { useQuery } from '@tanstack/react-query';
import { path } from 'ramda';
import dayjs from 'dayjs';

const { __ } = wp.i18n;

function AnimatedValueCell({ value }) {
  if (value || value == 0) {
    return value;
  }

  return (
    <span className="inline-block animate-pulse rounded bg-slate-200 h-6 w-16"></span>
  )
}

function DashboardWidget({ title, value, valueType = 'money' }) {
  return (
    <li className="mb-0">
      <div className="bg-white p-4 border border-[#e0e0e0] border-solid">
        <div className="mb-4 text-[#555]">
          <span className="text-sm font-bold">{title}</span>
        </div>
        <div className={classNames('flex justify-end', {
          'animate-pulse': !value && value != 0,
        })}>
          <div className={classNames('mb-1 font-medium text-[#1E1E1E]', {
            'h-6 w-16 bg-slate-200 rounded': !value && value != 0,
          })}>
            <span className="text-xl">
              {
                (!!value || value == 0) && (
                  <span>
                    {valueType === 'money' ? '$' : ''}
                    {new Intl.NumberFormat().format(value)}
                  </span>
                )
              }
            </span>
          </div>
          {/* <div className="p-1 rounded bg-[#F0F0F0] text-[#1E1E1E] h-6 w-8 bg-slate-200 rounded">
            <span className="text-xs"></span>
          </div> */}
        </div>
      </div>
    </li>
  )
}

function QuotaUsageWidget({ title, value }) {
  return (
    <div>
      <div className="bg-white p-4 border border-[#e0e0e0] border-solid">
        <div className="mb-4 text-[#555]">
          <span className="text-sm font-bold">{title}</span>
        </div>
        <div className="grid grid-cols-4 gap-x-2">
          <div>
            <div>Members</div>
            <div className="flex items-center">
              <span className="font-bold"><AnimatedValueCell value={value?.memberCount} /></span>
              <span className="px-1">/</span>
              <span>
                {
                  value?.memberLimit == 0 ? 'Unlimited' : (
                    <AnimatedValueCell value={value?.memberLimit} />
                  )
                }
              </span>
            </div>
          </div>
          <div>
            <div>Orders</div>
            <div className="flex items-center">
              <span className="font-bold"><AnimatedValueCell value={value?.spendingRecordCount} /></span>
              <span className="px-1">/</span>
              <span>
                {
                  value?.spendingRecordLimit == 0 ? 'Unlimited' : (
                    <AnimatedValueCell value={value?.spendingRecordLimit} />
                  )
                }
              </span>
            </div>
          </div>
          <div>
            <div>Reward Schemes</div>
            <div className="flex items-center">
              <span className="font-bold"><AnimatedValueCell value={value?.rewardSchemeCount} /></span>
              <span className="px-1">/</span>
              <span>
                {
                  value?.rewardSchemeLimit == 0 ? 'Unlimited' : (
                    <AnimatedValueCell value={value?.rewardSchemeLimit} />
                  )
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardList({ title, columns = [], items = [] }) {
  return (
    <div className="mb-6">
      <h3>{title}</h3>
      <table className="wp-list-table widefat fixed striped posts">
        <thead>
          <tr>
            {
              columns.map(column => (
                <th key={column.key} scope="col" className={column.className}>
                  {column.label}
                </th>
              ))
            }
          </tr>
        </thead>

        <tbody id="the-list">
          {
            !items && Array(5).fill(0).map((_, index) => (
              <tr key={index}>
                {
                  columns.map(column => (
                    <td key={column.key}>
                      <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div>
                    </td>
                  ))
                }
              </tr>
            ))
          }
          {
            items && items.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No items found
                </td>
              </tr>
            )
          }
          {
            items && items.map((item, index) => (
              <tr key={index}>
                {
                  columns.map(column => {
                    let value = path(column.key.split('.'), item);

                    if (column.format) {
                      value = column.format(value);
                    }

                    return (
                      <td
                        key={column.key}
                        className={column.className}
                      >
                        {value}
                      </td>
                    )
                  })
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

function AnnouncementWrapper({ nonce }) {
  // notice-error, notice-warning, notice-success, notice-info
  const { data } = useQuery({ queryKey: ['announcements'], queryFn: async () => {
    const result = await apiFetch({
      path: '/fav/v1/announcements',
      headers: {
        'X-WP-Nonce': nonce,
      }
    });

    return result;
  }});

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div>
      {
        data?.map(announcement => (
          <div
            id={announcement.id}
            className="notice notice-info py-3"
          >
            <div className="flex">
              <div className="flex-1">
                <strong>{announcement.title}</strong>
              </div>
              {/* <div
                className="cursor-pointer flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path></svg>
              </div> */}
            </div>
            {
              !!announcement.body && (
                <div className="mt-1">
                  <div>{announcement.body}</div>
                </div>
              )
            }
            {/* <div className="mt-2">
              <a href="#" className="button">Dismiss</a>
            </div> */}
          </div>
        ))
      }
    </div>
  )
}

export default function Dashboard({ nonce }) {
  const { data } = useQuery({ queryKey: ['dashboard'], queryFn: async () => {
    const result = await apiFetch({
      path: '/fav/v1/dashboard',
      headers: {
        'X-WP-Nonce': nonce,
      }
    });

    return result;
  }});

  return (
    <>
      <AnnouncementWrapper nonce={nonce} />
      <div className="max-w-[1280px]">
        <div className="mb-2">
          <h1 className="wp-heading-inline">{__('FavCRM for WooCommerce', 'favcrm-for-woocommerce')}</h1>
          <hr className="wp-header-end" />
        </div>
        <div>
          <div className="mb-6">
            <ul className="bg-[#f0f0f0] grid grid-cols-3 gap-6">
              <DashboardWidget
                title="Total Sales"
                value={data?.totalSpendings}
              />
              <DashboardWidget
                title="Total Members"
                value={data?.totalMembers}
                valueType="number"
              />
              <DashboardWidget
                title="Total Reward Points"
                value={data?.totalRewardPoints}
                valueType="number"
              />
              <DashboardWidget
                title="Total Orders"
                value={data?.totalOrders}
                valueType="number"
              />
            </ul>
          </div>
          <QuotaUsageWidget
            title="Account Quota Usage"
            value={data?.quotaUsage}
          />
          <div className="grid grid-cols-2 gap-x-6">
            <DashboardList
              title="Recent Members"
              items={data?.recentMembers}
              columns={[
                { key: 'code', label: 'Code' },
                { key: 'name', label: 'Name' },
                { key: 'phone', label: 'Phone' },
                { key: 'points', label: 'Points', className: 'text-right', format: (value) => new Intl.NumberFormat().format(value) },
                { key: 'stamps', label: 'Stamps', className: 'text-right', format: (value) => new Intl.NumberFormat().format(value) },
                { key: 'createdAt', label: 'Created At', format: (value) => dayjs(value).format('YYYY-MM-DD HH:mm') },
              ]}
            />
            <DashboardList
              title="Recent Transactions"
              items={data?.recentRewardTransactions}
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'member.code', label: 'Member Code' },
                { key: 'points', label: 'Points', className: 'text-right', format: (value) => new Intl.NumberFormat().format(value) },
                { key: 'createdAt', label: 'Created At', format: (value) => dayjs(value).format('YYYY-MM-DD HH:mm') },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  )
}

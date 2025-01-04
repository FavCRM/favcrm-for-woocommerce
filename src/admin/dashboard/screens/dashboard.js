import React from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import AnnouncementWrapper from './components/announcement-wrapper';
import UpdateNotice from './components/update-notice';
import DashboardWidget from './components/dashboard-widget';
import QuotaUsageWidget from './components/quota-usage-widget';
import DashboardList from './components/dashboard-list';

const { __ } = wp.i18n;

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
      <UpdateNotice nonce={nonce} />
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

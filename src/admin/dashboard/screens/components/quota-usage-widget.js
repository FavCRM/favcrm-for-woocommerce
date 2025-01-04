const { __ } = wp.i18n;

import AnimatedValueCell from './animated-value-cell';

export default function QuotaUsageWidget({ title, value }) {
  return (
    <div>
      <div className="bg-white p-4 border border-[#e0e0e0] border-solid">
        <div className="mb-4 text-[#555]">
          <span className="text-sm font-bold">{title}</span>
        </div>
        <div className="grid grid-cols-4 gap-x-2">
          <div>
            <div>{__('Members', 'favcrm-for-woocommerce')}</div>
            <div className="flex items-center">
              <span className="font-bold"><AnimatedValueCell value={value?.memberCount} /></span>
              <span className="px-1">/</span>
              <span>
                {
                  value?.memberLimit == 0 ? __('Unlimited', 'favcrm-for-woocommerce') : (
                    <AnimatedValueCell value={value?.memberLimit} />
                  )
                }
              </span>
            </div>
          </div>
          <div>
            <div>{__('Orders', 'favcrm-for-woocommerce')}</div>
            <div className="flex items-center">
              <span className="font-bold"><AnimatedValueCell value={value?.spendingRecordCount} /></span>
              <span className="px-1">/</span>
              <span>
                {
                  value?.spendingRecordLimit == 0 ? __('Unlimited', 'favcrm-for-woocommerce') : (
                    <AnimatedValueCell value={value?.spendingRecordLimit} />
                  )
                }
              </span>
            </div>
          </div>
          <div>
            <div>{__('VIP Tiers', 'favcrm-for-woocommerce')}</div>
            <div className="flex items-center">
              <span className="font-bold"><AnimatedValueCell value={value?.rewardSchemeCount} /></span>
              <span className="px-1">/</span>
              <span>
                {
                  value?.membershipTierLimit == 0 ? __('Unlimited', 'favcrm-for-woocommerce') : (
                    <AnimatedValueCell value={value?.membershipTierLimit} />
                  )
                }
              </span>
            </div>
          </div>
          <div>
            <div>{__('Reward Schemes', 'favcrm-for-woocommerce')}</div>
            <div className="flex items-center">
              <span className="font-bold"><AnimatedValueCell value={value?.rewardSchemeCount} /></span>
              <span className="px-1">/</span>
              <span>
                {
                  value?.rewardSchemeLimit == 0 ? __('Unlimited', 'favcrm-for-woocommerce') : (
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

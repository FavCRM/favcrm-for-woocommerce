import { registerPlugin } from '@wordpress/plugins';
import { __, sprintf } from '@wordpress/i18n';
import { ExperimentalDiscountsMeta } from '@woocommerce/blocks-checkout';
import { useState } from '@wordpress/element';
import classNames from 'classnames';

import LoadingSpinner from '../../../src/components/LoadingSpinner';

const { extensionCartUpdate } = window.wc.blocksCheckout;

function UseCredit({ extensions, cart }) {
  const [credits, setCredits] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isCreditApplied = cart?.cartFees?.some(fee => fee.key === 'cash-rewards');
  const [showCancel, setShowCancel] = useState(isCreditApplied);

  const isDisabled = extensions?.fav?.isLoggedIn !== true;
  const cardRewards = Intl.NumberFormat().format(extensions?.fav?.cashRewards ?? 0);

  const maxCredits = Math.min(extensions?.fav?.cashRewards, cart?.cartTotals?.total_price) ?? 0;

  const handleCreditsChange = (e) => {
    const value = e.target.value;

    if (value > extensions?.fav?.cashRewards) {
      setError('You don\'t have enough credits to redeem');
    } else {
      setError(null);
    }

    setCredits(Math.min(value, maxCredits));
  }

  const handleUseCredits = (credits) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    extensionCartUpdate({
      namespace: 'fav-cash-rewards',
      data: {
        credits,
      },
    }).then((result) => {
      const isCreditApplied = result?.fees.some(fee => fee.key === 'cash-rewards');

      setShowCancel(isCreditApplied);
      setIsLoading(false);

    });
  }

  const handleReset = () => {
    handleUseCredits(credits * -1);
  }

  return (
    <div className="border-t mt-[16px] wc-block-components-totals-coupon__form">
      <div className="p-[0_16px] mb-2 w-full">
        <div>
          <div>
            {
               isDisabled && (
                <div className="border-t wc-block-components-totals-coupon__form bg-[#EEE] mb-3">
                  <div className="p-[0_16px] w-full text-[#666] text-sm">
                    Please login first to use your credits
                  </div>
                </div>
              )
            }
            {
              !isDisabled && (
                <div className="mb-3">{sprintf(__('Your card reward balance is %s', 'favcrm-for-woocommerce'), cardRewards)}</div>
              )
            }
            {
              showCancel && (
                <div>
                  <div
                    className="underline underline-offset-1 text-sm cursor-pointer text-gray-700"
                    onClick={handleReset}
                  >
                    <span className="wc-block-components-button__text">{__('Reset', 'favcrm-for-woocommerce')}</span>
                  </div>
                </div>
              )
            }
          </div>
          {
            !showCancel && (
              <div>
                <div className="mb-1 text-sm text-gray-700">{__('Enter the amount you\'d like to redeem')}</div>
                <div className="flex flex-wrap gap-2 w-full">
                  <div className="wc-block-components-text-input !mt-0 flex-1 is-active">
                    <input
                      id="credit-input"
                      className={classNames('border rounded-md p-2', {
                        '!bg-[#EEE]': isDisabled,
                      })}
                      type="number"
                      autoCapitalize="off"
                      autoComplete="off"
                      aria-label={__('Credit input', 'favcrm-for-woocommerce')}
                      aria-invalid="false"
                      value={credits}
                      onChange={handleCreditsChange}
                      min={0}
                      max={maxCredits}
                      disabled={isDisabled}
                    />
                    <label htmlFor="credit-input">{__('Credit input', 'favcrm-for-woocommerce')}</label>
                  </div>
                  <button
                    type="button"
                    className={classNames('text-white px-4 py-2 rounded-md', {
                      'cursor-not-allowed': isDisabled || !credits || error,
                      'bg-[#32373c]': !isDisabled && credits && !error,
                      '!bg-gray-400': isDisabled || !credits || error,
                    })}
                    disabled={isDisabled || !credits || error}
                    onClick={() => {
                      handleUseCredits(credits)
                    }}
                  >
                    {
                      isLoading
                        ? <LoadingSpinner isLoading={true} size="size-6" color="text-white" />
                        : <span className="wc-block-components-button__text">{__('Apply', 'favcrm-for-woocommerce')}</span>
                    }
                  </button>
                </div>
              </div>
            )
          }
        </div>
        {
          error && <div className="text-red-500 text-sm mt-2">{error}</div>
        }
      </div>
    </div>
  )
}

const render = () => {
  return (
    <ExperimentalDiscountsMeta>
      <UseCredit />
    </ExperimentalDiscountsMeta>
  );
};

registerPlugin( 'favored-use-credit', {
  render,
  scope: 'woocommerce-checkout',
} );

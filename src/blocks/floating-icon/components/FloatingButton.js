import { __ } from '@wordpress/i18n'
import { Gift, X } from 'feather-icons-react'

export default function FloatingButton({ show, setShow }) {
  return (
    <div
      className="fixed left-8 bottom-8 bg-gray-700 text-white rounded-2xl px-4 py-3 flex gap-x-2 cursor-pointer hover:bg-gray-500 duration-200"
      onClick={() => setShow(!show)}
    >
      {
        show
          ? <X />
          : (
            <>
              <Gift />
              <div>{__('Member Zone', 'favcrm-for-woocommerce')}</div>
            </>
          )
      }

    </div>
  )
}

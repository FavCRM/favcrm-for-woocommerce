import { useEffect, useState } from '@wordpress/element'

export default function ThingsToDoNext() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('favcrm_things_to_do_next')

    if (!dismissed) {
      setShow(true)
    }
  }, [])

  const handleDismiss = () => {
    setShow(false)

    localStorage.setItem('favcrm_things_to_do_next', 'dismissed')
  }

  if (!show) {
    return null
  }

  return (
    <div className="bg-white border border-[#e0e0e0] border-solid mb-6">
      <div className="p-4 border-solid border-[0] border-b border-[#e0e0e0] relative">
        <h2 className="text-xl font-semibold my-0">Things to do next</h2>
        <div
          className="absolute top-4 right-4 text-[#0073aa] text-xl cursor-pointer"
          onClick={handleDismiss}
        >
          &times;
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[1px] bg-[#e0e0e0]">
        <div className="p-4 bg-white flex items-start">
          <div className="flex items-center justify-center mt-1 w-6 h-6 rounded-full border border-solid border-[#0073aa] text-[#0073aa] mr-2">
            1
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold my-0">Setup the member program</h3>
            <p className="my-0">
              Go to the <a href="/wp-admin/admin.php?page=fav-crm-settings">settings page</a> and update cash reward policy and program name for your store.
            </p>
          </div>
        </div>
        <div className="p-4 bg-white flex items-start">
          <div className="flex items-center justify-center mt-1 w-6 h-6 rounded-full border border-solid border-[#0073aa] text-[#0073aa] mr-2">
            2
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold my-0">Setup the reward scheme</h3>
            <p className="my-0">
              Go to the <a href="/wp-admin/admin.php?page=fav-crm-reward-schemes">reward scheme</a> page, setup how much member can get for their purchase.
            </p>
          </div>
        </div>
        <div className="p-4 bg-white flex items-start">
          <div className="flex items-center justify-center mt-1 w-6 h-6 rounded-full border border-solid border-[#0073aa] text-[#0073aa] mr-2">
            3
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold my-0">Invite your first member</h3>
            <p className="my-0">
              You can create member manually at <a href="/wp-admin/admin.php?page=fav-crm-members">member page</a> or let member sign up in <a href="/account-register">account register</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

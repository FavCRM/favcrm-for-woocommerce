import { __ } from '@wordpress/i18n';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiFetch from '@wordpress/api-fetch';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form'
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useFetch } from '../../services/useFetch';
import FeatherIcon from 'feather-icons-react';

export default function GiftOfferForm({ nonce }) {
  const navigate = useNavigate();
  const { giftOfferId } = useParams();
  const [locale, setLocale] = useState('en')
  const [selectedFiles, setSelectedFiles] = useState([])

  // console.log({ giftOfferId })
  const {
    data: thisGiftOffer,
    isLoading: giftOfferLoading,
    error: giftOfferError,
    refetch: giftOfferRefresh
  } = useFetch("gift-offer", `/fav/v1/gift-offers/${giftOfferId}`, nonce)

  const {
    data: tiers,
    isLoading: tiersLoading,
    error: tiersError,
    refetch: tiersRefresh
  } = useFetch("membership-tiers", `/fav/v1/membership-tiers?page=1&page_size=1000`, nonce)

  const statusOptions = [
    { value: "DRAFT", name: "Draft" },
    { value: "ACTIVE", name: "Active" },
    { value: "DISABLED", name: "Disabled" },
  ]

  const isRedeemOptions = [
    { value: true, name: "Yes" },
    { value: false, name: "No" },
  ]


  useEffect(() => {
    const locale = document.documentElement.lang.split('-')[0];
    setLocale(locale)

    if (!giftOfferLoading) {
      // set existing records for PATCH update
      if (giftOfferId) {
        reset({
          ...thisGiftOffer,
          is_redeemable: thisGiftOffer?.isRedeemable,
          membership_tier_id: thisGiftOffer.membershipTier?.id,
        })
      }
    }
  }, [giftOfferLoading])

  const action = giftOfferId ? "Edit" : "Add"

  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      const keys = [
        "description",
        "membership_tier_id",
        "is_redeemable",
        "name",
        "points",
        "stamps",
        "status",
      ]

      Object.keys(data).forEach(key => {
        if (!keys.find(k => k === key)) {
          return
        }

        if (key === "is_redeemable") {
          formData.append(key, data[key] === "true" ? 1 : 0)
          return
        }
        formData.append(key, data[key])
      })

      // handle files input
      selectedFiles.length > 0 && selectedFiles.forEach(selectedFile => {
        formData.append("image", selectedFile.file)
      })

      // console.log("formData: ", Object.fromEntries(formData))

      if (!giftOfferId) {
        return await apiFetch({
          path: '/fav/v1/gift-offers',
          method: 'POST',
          headers: { 'X-WP-Nonce': nonce },
          body: formData,
        });
      }

      return await apiFetch({
        path: `/fav/v1/gift-offers/${giftOfferId}`,
        method: 'POST',
        headers: { 'X-WP-Nonce': nonce },
        body: formData,
      });

    },
    onSuccess: (data) => {
      if (data?.success) {
        window.location.href = '/wp-admin/admin.php?page=fav-crm-gift-offers';
      } else if (data?.errorCode || data?.error) {
        setError(data.error);
      }
    }
  });

  const onSubmit = (data) => {
    mutate(data);
  }

  return (
    (!giftOfferLoading && !tiersLoading) &&
    <div>
      <div className="mb-2 flex gap-2 ">
        <h1 className="wp-heading-inline">{__(`${action} Gift Offer`, 'favored')}</h1>
        <hr className="wp-header-end" />
        {
          !!giftOfferId &&
          <div className="my-auto">
            <button
              className="cursor-pointer p-1 text-red-800 bg-slate-50 border-solid border-red-800 rounded hover:text-white hover:bg-red-800"
              type="button"
              onClick={async () => {
                if (!confirm(`You are about to delete gift offer ${thisGiftOffer?.name}, click confirm to delete.`))
                  return

                const deleteResponse = await apiFetch({
                  path: `/fav/v1/gift-offers/${giftOfferId}`,
                  method: 'DELETE',
                  headers: {
                    'X-WP-Nonce': nonce,
                    'Content-Type': 'application/json',
                  },
                });

                window.location.href = '/wp-admin/admin.php?page=fav-crm-gift-offers';
              }}> Delete </button>
          </div>
        }
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="form-table">
            <tbody>
              <tr>
                <th scope="row">
                  <label for="Name">
                    {__('Name', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="name"
                    type="text"
                    className="regular-text"
                    {...register('name', { required: __('Gift offer name is required', 'favored') })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.name?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label for="description">
                    {__('Description', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="description"
                    type="text"
                    className="regular-text"
                    {...register('description', {})}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.description?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="membership_tier_id">
                    {__('Membership Tier', 'favored')}
                  </label>
                </th>
                <td>
                  <select
                    type="text"
                    className="regular-text"
                    {...register('membership_tier_id')}
                  >
                    <option value="">Select</option>
                    {
                      tiers.items?.map(tier => (
                        <option key={tier.id} value={tier.id}>{tier?.name}</option>
                      ))
                    }
                  </select>
                  {
                    errors.contactPerson && (
                      <div className="mt-1 error-message text-red-500 font-normal">{errors.membership_tier_id?.message}</div>
                    )
                  }
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label for="points">
                    {__('Points', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="points"
                    type="number"
                    className="regular-text"
                    {...register('points', {
                      required: __('Points is required', 'favored'),
                      valueAsNumber: true,
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.points?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label for="stamps">
                    {__('Stamps', 'favored')}
                  </label>
                </th>
                <td>
                  <input
                    id="stamps"
                    type="number"
                    className="regular-text"
                    {...register('stamps', {
                      required: __('Stamps is required', 'favored'),
                      valueAsNumber: true,
                    })}
                  />
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.stamps?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="status">
                    {__('Status', 'favored')}
                  </label>
                </th>
                <td>
                  <select
                    type="text"
                    className="regular-text"
                    {...register('status')}
                  >
                    <option value="">Select</option>
                    {
                      statusOptions?.map(status => (
                        <option key={status.value} value={status.value}>{status.name}</option>
                      ))
                    }
                  </select>
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.status?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="is_redeemable">
                    {__('Allow Member to redeem', 'favored')}
                  </label>
                </th>
                <td>
                  <select
                    type="text"
                    className="regular-text"
                    {...register('is_redeemable')}
                  >
                    <option value="">Select</option>
                    {
                      isRedeemOptions?.map(redeemable => (
                        <option key={redeemable.value} value={redeemable.value}>{redeemable.name}</option>
                      ))
                    }
                  </select>
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.is_redeemable?.message}</div>}
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <label htmlFor="image">
                    {__('Image (1000x1000)', 'favored')}
                  </label>
                </th>
                <td>
                  <div className="flex flex-col items-left rounded border-2 border-red-800">
                    <label className="w-fit h-fit flex gap-2 items-center p-1 border-solid rounded border border-black shadow-sm tracking-wide cursor-pointer">
                      <FeatherIcon icon="upload-cloud" />
                      <span className="">Select image</span>
                      <input
                        name="file"
                        type="file"
                        // multiple
                        accept=".jpeg,.jpg,.png"
                        className="hidden"
                        onChange={async (e) => {
                          const { name, files } = e.target
                          const filesObj = await Promise.all(Array.from(files).map(async file => {
                            const blobUrl = URL.createObjectURL(file)
                            const base64data = await fileToBase64(file)

                            return {
                              file,
                              blob: blobUrl,
                              b64: base64data,
                            }
                          }))

                          setSelectedFiles(() => filesObj)
                        }}
                      />
                    </label>
                    <ul id="uploadFiles" className="text-sm flex">
                      {
                        selectedFiles?.map((selectedFile, i) => {
                          return (
                            <div className="relative group cursor-pointer text-xs w-fit">
                              <img
                                width={75}
                                src={selectedFile.b64}
                                alt={selectedFile?.file?.name}
                                onClick={async () => window.open(await fileToBase64(selectedFile.file))}
                              />
                              <FeatherIcon
                                icon="x"
                                className="z-50 hidden group-hover:block w-fit h-fit absolute top-0 right-0 text-red-500 cursor-pointer"
                                onClick={() => {
                                  selectedFiles.splice(i, 1)
                                  setSelectedFiles(() => [...selectedFiles])
                                }}
                              />
                            </div>
                          )
                        })
                      }
                    </ul>
                    {
                      !!thisGiftOffer?.image && selectedFiles.length == 0 &&
                      <div className='w-fit cursor-pointer'>
                        <img
                          width={75}
                          src={thisGiftOffer?.image}
                          alt={thisGiftOffer?.image}
                          onClick={async () => window.open(thisGiftOffer?.image)}
                        />
                      </div>
                    }
                  </div>
                  {<div className="mt-1 error-message text-red-500 font-normal">{errors.image?.message}</div>}
                </td>
              </tr>

              <tr>
                <th scope="row">
                </th>
                <td>
                  {
                    error && (
                      <div className="error-message text-red-500 font-normal mb-4">error: {__(error, 'favored')}</div>
                    )
                  }
                  <div className="flex gap-2">
                    <button
                      className="button button-primary"
                      type="submit"
                      disabled={isMutating}
                    >
                      {
                        isMutating
                          ? <LoadingSpinner
                            isLoading={isMutating}
                            color="text-black"
                            size="size-4"
                          />
                          : __(!giftOfferId ? 'Add' : 'Save', 'favored')
                      }
                    </button>
                    <button
                      className="cursor-pointer p-2 rounded border border-red-700 text-red-700 bg-slate-50 hover:bg-slate-100"
                      type="button"
                      onClick={() => navigate(-1)}
                    >
                      {__(!giftOfferId ? 'Back' : 'Cancel', 'favored')}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  )
}

/**
 * fileToBase64 convert the selected File object to base64 (encode data to Base64)
 * @param {File} file
 * @return {Promise}
 */
const fileToBase64 = async file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

import apiFetch from '@wordpress/api-fetch';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Pagination } from '../../common/pagination';
import { __ } from '@wordpress/i18n';

export default function RewardTransactionList({ nonce }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reward-transactions'], queryFn: async () => {
      try {
        const result = await apiFetch({
          path: pageLink,
          headers: {
            'X-WP-Nonce': nonce,
          }
        });
        console.log({ result })

        return result;
      } catch (err) {
        console.error("failed to fetch reward-transactions, err: ", e.message)
      }
    }
  });

  const [currPage, setCurrPage] = useState(1);
  const pageLink = `/fav/v1/reward-transactions?page=${currPage}&page_size=20`
  const hasNextPage = +data?.page?.total_pages !== currPage
  const hasPrevPage = currPage > 1
  useEffect(() => { refetch() }, [currPage])

  return (
    <div>
      <div className="mb-2">
        <h1 className="wp-heading-inline">{__('Reward Transaction List', 'favored')}</h1>
        {/* <Link to="/add" className="page-title-action">{__('Add New Reward Transaction', 'favored')}</Link> */}
        <hr className="wp-header-end" />
      </div>
      <table className="wp-list-table widefat fixed striped posts">
        <thead>
          <tr>
            <td id="cb" className="manage-column column-cb check-column">
              <label className="screen-reader-text" htmlFor="cb-select-all-1">{__('Select All', 'favored')}</label>
              <input id="cb-select-all-1" type="checkbox" />
            </td>
            <th scope="col" id="title" className="manage-column column-title column-primary sortable desc">
              <span>ID</span>
            </th>
            <th scope="col" id="member" className="manage-column column-name">{__('Member', 'favored')}</th>
            <th scope="col" id="transactionType" className="manage-column column-amount">{__('Transaction Type', 'favored')}</th>
            <th scope="col" id="transactionObject" className="manage-column column-amount">{__('Transaction Object', 'favored')}</th>
            <th scope="col" id="Change" className="manage-column column-amount">{__('Change', 'favored')}</th>
            <th scope="col" id="date" className="manage-column column-date sortable asc">
              <a href="javascript:void(0)">
                <span>Created At</span><span className="sorting-indicator"></span>
              </a>
            </th>
          </tr>
        </thead>

        <tbody id="the-list">
          {
            isLoading && Array(10).fill(0).map((_, index) => (
              <tr key={index}>
                <td> <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div> </td>
                <td> <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div> </td>
                <td> <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div> </td>
                <td> <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div> </td>
                <td> <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div> </td>
                <td> <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div> </td>
                <td> <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div> </td>
              </tr>
            ))
          }
          {
            data?.items?.map(row => (
              <tr
                key={row.id}
                id={`transaction-${row.id}`}
                className="iedit author-self level-0 post-1 type-post status-publish format-standard hentry category-Dummy category"
              >
                <th scope="row" className="check-column">
                  <label className="screen-reader-text" htmlFor={`cb-select-${row.id}`}>Select Transaction #{row.id}</label>
                  <input id={`cb-select-${row.id}`} type="checkbox" name="transaction[]" value={row.id} />
                  <div className="locked-indicator">
                    <span className="locked-indicator-icon" aria-hidden="true"></span>
                    <span className="screen-reader-text">
                      {`Transaction #${row.id} is locked`}
                    </span>
                  </div>
                </th>
                <td className="id column-id page-title" data-colname="ID">
                  <strong> <div className="">{row.id.toString().padStart(6, '0')}</div> </strong>
                </td>
                <td className="name column-name has-row-actions column-primary" data-colname="Member">
                  <strong> <div className="">{row.member?.name}</div> </strong>
                </td>
                <td className="phone column-transaction-type" data-colname="Transaction Type">
                  <div className="">{row.transactionType}</div>
                </td>
                <td className="points column-transaction-object" data-colname="Transaction Object">
                  <span aria-hidden="true">
                    {!!row.spendingRecord?.amount && `Spending for ${(+row.spendingRecord?.amount)?.toLocaleString("en-US", { style: "currency", currency: "USD" })}`}
                  </span>
                  <span className="screen-reader-text">No tags</span>
                </td>
                <td className="points column-change" data-colname="Change">
                  <div className={+row.points > 0 ? 'text-green-600' : 'text-red-500'}>
                    {+row.points > 0 && '+'}{!!row.points && (+row.points)?.toLocaleString("en-HK", { style: 'decimal', minimumFractionDigits: '2' }) + ' Points'}
                  </div>
                  <div className={+row.stamps > 0 ? 'text-green-600' : 'text-red-500'}>
                    {+row.stamps > 0 && '+'}{!!row.stamps && (+row.stamps)?.toLocaleString("en-HK", { style: 'decimal' }) + ' Stamps'}
                  </div>
                </td>
                <td className="date column-created-at" data-colname="Created At">
                  <abbr title={row.createdAt}>{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}</abbr>
                </td>
              </tr>
            ))
          }
        </tbody>
        <tfoot>
          <tr>
            <td className="manage-column column-cb check-column">
              <label className="screen-reader-text" htmlFor="cb-select-all-2">{__('Select All', 'favored')}</label>
              <input id="cb-select-all-2" type="checkbox" />
            </td>
            <th scope="col" className="manage-column column-title column-primary sortable desc">
              <span>ID</span>
            </th>
            <th scope="col" className="manage-column column-member">{__('Member', 'favored')}</th>
            <th scope="col" className="manage-column column-transaction-type">{__('Transaction Type', 'favored')}</th>
            <th scope="col" className="manage-column column-transaction-object">{__('Transaction Object', 'favored')}</th>
            <th scope="col" className="manage-column column-change">{__('Change', 'favored')}</th>
            <th scope="col" className="manage-column column-date sortable asc">
              <a href="javascript:void(0)">
                <span>{__('Date', 'favored')}</span>
                <span className="sorting-indicator"></span>
              </a>
            </th>
          </tr>
        </tfoot>
      </table>

      <Pagination {...{ setCurrPage, hasPrevPage, hasNextPage, data }} />
    </div>
  );
}

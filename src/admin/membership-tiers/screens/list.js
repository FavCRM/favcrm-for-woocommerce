import apiFetch from '@wordpress/api-fetch';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Pagination } from '../../common/pagination';

export default function MembershipTierList({ nonce }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['membership-tiers'], queryFn: async () => {
      try {
        const result = await apiFetch({
          // path: '/fav/v1/membership-tiers',
          path: pageLink,
          headers: {
            'X-WP-Nonce': nonce,
          }
        });
        // console.log({ result })

        return result;
      } catch (err) {
        console.error("failed to fetch membership-tiers, err: ", e.message)
      }
    }
  });

  const [currPage, setCurrPage] = useState(1);
  const pageLink = `/fav/v1/membership-tiers?page=${currPage}&page_size=20`
  const hasNextPage = +data?.page?.total_pages !== currPage
  const hasPrevPage = currPage > 1
  useEffect(() => { refetch() }, [currPage])

  return (
    <div>
      <div className="mb-2">
        <h1 className="wp-heading-inline">Membership Tier List</h1>
        <Link to="/add" className="page-title-action">Add New Membership Tier</Link>
        <hr className="wp-header-end" />
      </div>
      <table className="wp-list-table widefat table-fixed striped posts">
        <thead>
          <tr>
            <td id="cb" className="manage-column column-cb check-column">
              <label className="screen-reader-text" htmlFor="cb-select-all-1">Select All</label>
              <input id="cb-select-all-1" type="checkbox" />
            </td>
            <th scope="col" id="title" className="manage-column column-title column-primary sortable desc w-28">
              <span>ID</span>
            </th>
            <th scope="col" id="author" className="manage-column column-name w-48">Name</th>
            <th scope="col" id="categories" className="manage-column column-count w-16">Count</th>
            <th scope="col" id="tags" className="manage-column column-total-spending-amount w-48"><span className="block text-right">Total Spending Amount</span></th>
            <th scope="col" id="tags" className="manage-column column-multiplier w-24">Multiplier</th>
            <th scope="col" id="tags" className="manage-column column-discount w-24">Discount</th>
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
                <td>
                  <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div>
                </td>
                <td>
                  <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div>
                </td>
                <td>
                  <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div>
                </td>
                <td>
                  <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div>
                </td>
                <td>
                  <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div>
                </td>
                <td>
                  <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div>
                </td>
                <td>
                  <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div>
                </td>
                <td>
                  <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div>
                </td>
              </tr>
            ))
          }
          {
            data?.items?.map(row => (
              <tr
                key={row.id}
                id={`member-${row.id}`}
                className="iedit author-self level-0 post-1 type-post status-publish format-standard hentry category-Dummy category"
              >
                <th scope="row" className="check-column">
                  <label className="screen-reader-text" htmlFor={`cb-select-${row.id}`}>Select Member #{row.id}</label>
                  <input id={`cb-select-${row.id}`} type="checkbox" name="member[]" value={row.id} />
                  <div className="locked-indicator">
                    <span className="locked-indicator-icon" aria-hidden="true"></span>
                    <span className="screen-reader-text">
                      {`Member #${row.id} is locked`}
                    </span>
                  </div>
                </th>
                <td className="id column-id page-title" data-colname="ID">
                  <strong> <Link to={`/edit/${row.id}`} className="">{row.id.toString().padStart(6, '0')}</Link> </strong>
                </td>
                <td className="name column-name has-row-actions column-primary" data-colname="Name">
                  <strong> <Link to={`/edit/${row.id}`} className="">{row.name}</Link> </strong>
                </td>
                <td className="phone column-phone" data-colname="Count">
                  <span>{row.count}</span>
                </td>
                <td className="points column-points" data-colname="TotalSpendingAmount">
                  <span aria-hidden="true" className='block w-full text-right'>
                    {(+row.totalSpendingAmount)?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </span>
                  <span className="screen-reader-text">No tags</span>
                </td>
                <td className="stamps column-stamps" data-colname="Multiplier">
                  <span aria-hidden="true">{row.multiplier}</span>
                  <span className="screen-reader-text">No tags</span>
                </td>
                <td className="stamps column-stamps" data-colname="Discount">
                  <span aria-hidden="true">{row.discount}</span>
                  <span className="screen-reader-text">No tags</span>
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
              <label className="screen-reader-text" htmlFor="cb-select-all-2">Select All</label>
              <input id="cb-select-all-2" type="checkbox" />
            </td>
            <th scope="col" className="manage-column column-title column-primary sortable desc">
              <span>ID</span>
            </th>
            <th scope="col" className="manage-column column-author">Name</th>
            <th scope="col" className="manage-column column-categories">Count</th>
            <th scope="col" className="manage-column column-tags"><span className="block text-right">Total Spending Amount</span></th>
            <th scope="col" className="manage-column column-tags">Multiplier</th>
            <th scope="col" className="manage-column column-tags">Discount</th>
            <th scope="col" className="manage-column column-date sortable asc">
              <a href="javascript:void(0)">
                <span>Date</span>
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

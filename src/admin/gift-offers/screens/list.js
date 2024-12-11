import apiFetch from '@wordpress/api-fetch';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Pagination } from '../../common/pagination';
import { __ } from '@wordpress/i18n';

export default function GiftOfferList({ nonce }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['gift-offers'], queryFn: async () => {
      try {
        const result = await apiFetch({
          path: pageLink,
          headers: {
            'X-WP-Nonce': nonce,
          }
        });
        // console.log({ result })

        return result;
      } catch (err) {
        console.error("failed to fetch gift-offers, err: ", e.message)
      }
    }
  });

  const [currPage, setCurrPage] = useState(1);
  const pageLink = `/fav/v1/gift-offers?page=${currPage}&page_size=20`
  const hasNextPage = +data?.page?.total_pages !== currPage
  const hasPrevPage = currPage > 1
  useEffect(() => { refetch() }, [currPage])

  return (
    <div>
      <div className="mb-2">
        <h1 className="wp-heading-inline">{__('Gift Offer List', 'favored')}</h1>
        <Link to="/add" className="page-title-action">{__('Add New Gift Offer', 'favored')}</Link>
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
            <th scope="col" id="author" className="manage-column column-name">{__('Name', 'favored')}</th>
            <th scope="col" id="tags" className="manage-column column-points">{__('Points', 'favored')}</th>
            <th scope="col" id="categories" className="manage-column column-start-date">{__('Start Date', 'favored')}</th>
            <th scope="col" id="categories" className="manage-column column-end-date">{__('End Date', 'favored')}</th>
            <th scope="col" id="tags" className="manage-column column-status">{__('Status', 'favored')}</th>
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
                id={`scheme-${row.id}`}
                className="iedit author-self level-0 post-1 type-post status-publish format-standard hentry category-Dummy category"
              >
                <th scope="row" className="check-column">
                  <label className="screen-reader-text" htmlFor={`cb-select-${row.id}`}>Select Scheme #{row.id}</label>
                  <input id={`cb-select-${row.id}`} type="checkbox" name="scheme[]" value={row.id} />
                  <div className="locked-indicator">
                    <span className="locked-indicator-icon" aria-hidden="true"></span>
                    <span className="screen-reader-text">
                      {`Scheme #${row.id} is locked`}
                    </span>
                  </div>
                </th>
                <td className="id column-id page-title" data-colname="ID">
                  <strong> <Link to={`/edit/${row.id}`} className="">{row.id.toString().padStart(6, '0')}</Link> </strong>
                </td>
                <td className="name column-name has-row-actions column-primary" data-colname="Name">
                  <strong> <Link to={`/edit/${row.id}`} className="">{row.name}</Link> </strong>
                </td>
                <td className="points column-points" data-colname="Points">
                  <span aria-hidden="true">{row.points}</span>
                  <span className="screen-reader-text">No tags</span>
                </td>
                <td className="date column-start-date" data-colname="Start Date">
                  <abbr title={row.startDate}>{row.startDate ? dayjs(row.startDate).format('YYYY-MM-DD HH:mm:ss') : '-'}</abbr>
                </td>
                <td className="date column-end-date" data-colname="End Date">
                  <abbr title={row.endDate}>{row.endDate ? dayjs(row.endDate).format('YYYY-MM-DD HH:mm:ss') : '-'}</abbr>
                </td>
                <td className="stamps column-status" data-colname="Status">
                  <span aria-hidden="true">{row.status}</span>
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
              <label className="screen-reader-text" htmlFor="cb-select-all-2">{__('Select All', 'favored')}</label>
              <input id="cb-select-all-2" type="checkbox" />
            </td>
            <th scope="col" className="manage-column column-title column-primary sortable desc">
              <span>ID</span>
            </th>
            <th scope="col" className="manage-column column-author">{__('Name', 'favored')}</th>
            <th scope="col" className="manage-column column-points">{__('Points', 'favored')}</th>
            <th scope="col" className="manage-column column-start-date">{__('Start Date', 'favored')}</th>
            <th scope="col" className="manage-column column-end-date">{__('End Date', 'favored')}</th>
            <th scope="col" className="manage-column column-status">{__('Status', 'favored')}</th>
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

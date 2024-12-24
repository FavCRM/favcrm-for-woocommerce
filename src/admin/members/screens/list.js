import apiFetch from '@wordpress/api-fetch';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Pagination } from '../../common/pagination';

export default function MemberList({ nonce }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['members', querystring],
    queryFn: async () => {
      try {
        const result = await apiFetch({
          path: `${pageLink}?${new URLSearchParams(querystring).toString()}`,
          headers: {
            'X-WP-Nonce': nonce,
          },
        });
        return result;
      } catch (err) {
        console.error("failed to fetch members, err: ", err.message);
      }
    }
  });

  const [querystring, setQuerystring] = useState({
    page: 1,
    page_size: 20,
    search: '',
  });

  const pageLink = `/fav/v1/members`
  const hasNextPage = +data?.page?.total_pages !== querystring.page
  const hasPrevPage = querystring.page > 1

  useEffect(() => {
    const handler = setTimeout(() => {
      refetch();
    }, 500); // debounce delay

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or on new input
    };
  }, [querystring, refetch]);

  const handleInputChange = (e) => {
    setQuerystring((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <h1 className="wp-heading-inline my-auto pt-0">Member List</h1>
        <Link to="/edit" className="page-title-action mt-auto">Add New Member</Link>
        <div className="relative my-auto h-6">
          <label htmlFor="Search" className="sr-only">Search</label>
          <input
            type="text"
            id="Search"
            name="search"
            placeholder="Search for..."
            className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                refetch();
              }
            }}
          />

          <span
            className="flex absolute inset-y-0 end-0 w-10 h-8 place-content-center cursor-pointer"
            onClick={() => refetch()}
          >
            <div className="m-auto text-gray-600 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </span>
        </div>

        <hr className="wp-header-end" />
      </div>
      <table className="wp-list-table widefat fixed striped posts">
        <thead>
          <tr>
            <td id="cb" className="manage-column column-cb check-column">
              <label className="screen-reader-text" htmlFor="cb-select-all-1">Select All</label>
              <input id="cb-select-all-1" type="checkbox" />
            </td>
            <th scope="col" id="title" className="manage-column column-title column-primary sortable desc">
              <span>ID</span>
            </th>
            <th scope="col" id="author" className="manage-column column-name">Name</th>
            <th scope="col" id="categories" className="manage-column column-phone">Phone</th>
            <th scope="col" id="tags" className="manage-column column-points">Points</th>
            <th scope="col" id="tags" className="manage-column column-stamps">Stamps</th>
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
                  <strong className="row-id"> <Link to={`/edit/${row.uuid}`} className="">{row.code?.toString().padStart(6, '0')}</Link> </strong>
                </td>
                <td className="name column-name has-row-actions column-primary" data-colname="Name">
                  <strong> <Link to={`/edit/${row.uuid}`} className="">{row.name}</Link> </strong>
                  <button type="button" className="toggle-row"><span className="screen-reader-text">Show more details</span></button>
                </td>
                <td className="phone column-phone" data-colname="Phone">
                  <a href="javascript:void(0)">{row.phone}</a>
                </td>
                <td className="points column-points" data-colname="Points">
                  <span aria-hidden="true">{row.points}</span>
                  <span className="screen-reader-text">No tags</span>
                </td>
                <td className="stamps column-stamps" data-colname="Stamps">
                  <span aria-hidden="true">{row.stamps}</span>
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
            <th scope="col" className="manage-column column-categories">Phone</th>
            <th scope="col" className="manage-column column-tags">Points</th>
            <th scope="col" className="manage-column column-tags">Stamps</th>
            {/* <th scope="col" className="manage-column column-comments num sortable desc"> */}
            {/*   <span> */}
            {/*     <span className="vers comment-grey-bubble" title="Comments"> */}
            {/*       <span className="screen-reader-text">Comments</span> */}
            {/*     </span> */}
            {/*   </span> */}
            {/* </th> */}
            <th scope="col" className="manage-column column-date sortable asc">
              <a href="javascript:void(0)">
                <span>Date</span>
                <span className="sorting-indicator"></span>
              </a>
            </th>
          </tr>
        </tfoot>
      </table>

      <Pagination {...{ setQuerystring, hasPrevPage, hasNextPage, data }} />
    </div>
  );
}

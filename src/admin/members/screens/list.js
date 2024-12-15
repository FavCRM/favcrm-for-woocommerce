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
      // console.log({ query: new URLSearchParams(querystring).toString() });
      try {
        const result = await apiFetch({
          path: `${pageLink}?${new URLSearchParams(querystring).toString()}`,
          headers: {
            'X-WP-Nonce': nonce,
          },
        });
        // console.log({ result });
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
        <div className="my-auto h-6">
          <input
            type="text"
            placeholder="search"
            name="search"
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                refetch(); // Fetch immediately on Enter key press
              }
            }}
          />
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
                  {/* <a className="row-id" href="javascript:void(0)" aria-label={`Member #${row.id} (Edit)`}></a> */}
                  <strong className="row-id"> <Link to={`/edit/${row.uuid}`} className="">{row.id.toString().padStart(6, '0')}</Link> </strong>
                </td>
                <td className="name column-name has-row-actions column-primary" data-colname="Name">
                  <strong> <Link to={`/edit/${row.uuid}`} className="">{row.name}</Link> </strong>
                  {/*
                  <div className="row-actions">
                    <span className="edit"><Link to={`/edit/${row.id}`} className="">Edit</Link> | </span>
                    <span className="inline hide-if-no-js"><button type="button" className="button-link editinline" aria-label={`Quick edit Member #${row.id} inline`} aria-expanded="false">Quick Edit</button> | </span>
                    <span className="trash"><a href="javascript:void(0)" className="submitdelete" aria-label={`Move Member #${row.id} to the Trash`}>Trash</a> | </span>
                    <span className="view"><a href="javascript:void(0)" rel="bookmark" aria-label={`View Member #${row.id}`}>View</a></span>
                  </div>
                  */}
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

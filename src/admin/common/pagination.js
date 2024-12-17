const Pagination = (props) => {

  const { setQuerystring, setCurrPage, hasPrevPage, hasNextPage, data, bulkAction = false } = props

  return <>
    <div className="tablenav bottom">
      <div className="alignleft actions bulkactions">
        {bulkAction ?
          <>
            <label for="bulk-action-selector-bottom" className="screen-reader-text">Select bulk action</label><select name="action2" id="bulk-action-selector-bottom">
              <option value="-1">Bulk actions</option>
              <option value="edit" className="hide-if-no-js">Edit</option>
              <option value="trash">Move to Trash</option>
            </select>
            <input type="submit" id="doaction2" className="button action" value="Apply" />
          </>
          : <></>}
      </div>

      <div className="alignleft actions">
      </div>
      <div className="tablenav-pages"><span className="displaying-num">{data?.page?.page_size} items</span>
        <span className="pagination-links"><span className={`tablenav-pages-navspan button ${hasPrevPage ? '' : 'disabled'}`}
          onClick={() => hasPrevPage && !!setCurrPage ? setCurrPage(() => 1) : setQuerystring(query => ({ ...query, page: 1 }))}
        >«</span>
          <span className={`tablenav-pages-navspan button ${hasPrevPage ? '' : 'disabled'}`}
            onClick={() => hasPrevPage && !!setCurrPage ? setCurrPage((currPage) => currPage - 1) : setQuerystring(query => ({ ...query, page: query.page - 1 }))}
          >‹</span>
          <span className="screen-reader-text">Current Page</span><span id="table-paging" className="paging-input"><span className="tablenav-paging-text">{data?.page?.current_page} of <span className="total-pages">{data?.page?.total_pages}</span></span></span>
          <span className={`tablenav-pages-navspan button ${hasNextPage ? '' : 'disabled'}`}
            onClick={() => hasNextPage && !!setCurrPage ? setCurrPage((currPage) => currPage + 1) : setQuerystring(query => ({ ...query, page: query.page + 1 }))}
          > › </span>
          <span className={`tablenav-pages-navspan button ${hasNextPage ? '' : 'disabled'}`}
            onClick={() => hasNextPage && !!setCurrPage ? setCurrPage(() => +data?.page?.total_pages) : setQuerystring(query => ({ ...query, page: +data?.page?.total_pages }))}
          >»</span></span></div>
      <br className="clear" />
    </div>
  </>
}

export { Pagination }

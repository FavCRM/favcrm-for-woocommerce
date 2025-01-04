import { path } from 'ramda';

export default function DashboardList({ title, columns = [], items = [] }) {
  return (
    <div className="mb-6">
      <h3>{title}</h3>
      <table className="wp-list-table widefat fixed striped posts">
        <thead>
          <tr>
            {
              columns.map(column => (
                <th key={column.key} scope="col" className={column.className}>
                  {column.label}
                </th>
              ))
            }
          </tr>
        </thead>

        <tbody id="the-list">
          {
            !items && Array(5).fill(0).map((_, index) => (
              <tr key={index}>
                {
                  columns.map(column => (
                    <td key={column.key}>
                      <div className="animate-pulse rounded-md bg-[#AAA] h-6"></div>
                    </td>
                  ))
                }
              </tr>
            ))
          }
          {
            items && items.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No items found
                </td>
              </tr>
            )
          }
          {
            items && items.map((item, index) => (
              <tr key={index}>
                {
                  columns.map(column => {
                    let value = path(column.key.split('.'), item);

                    if (column.format) {
                      value = column.format(value);
                    }

                    return (
                      <td
                        key={column.key}
                        className={column.className}
                      >
                        {value}
                      </td>
                    )
                  })
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

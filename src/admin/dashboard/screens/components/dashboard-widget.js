import classNames from 'classnames';

export default function DashboardWidget({ title, value, valueType = 'money' }) {
  return (
    <li className="mb-0">
      <div className="bg-white p-4 border border-[#e0e0e0] border-solid">
        <div className="mb-4 text-[#555]">
          <span className="text-sm font-bold">{title}</span>
        </div>
        <div className={classNames('flex justify-end', {
          'animate-pulse': !value && value != 0,
        })}>
          <div className={classNames('mb-1 font-medium text-[#1E1E1E]', {
            'h-6 w-16 bg-slate-200 rounded': !value && value != 0,
          })}>
            <span className="text-xl">
              {
                (!!value || value == 0) && (
                  <span>
                    {valueType === 'money' ? '$' : ''}
                    {new Intl.NumberFormat().format(value)}
                  </span>
                )
              }
            </span>
          </div>
          {/* <div className="p-1 rounded bg-[#F0F0F0] text-[#1E1E1E] h-6 w-8 bg-slate-200 rounded">
            <span className="text-xs"></span>
          </div> */}
        </div>
      </div>
    </li>
  )
}

import { faArrowDown, faArrowsUpDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { sortDto } from '@/common/interface/pagination'
import { cn } from '@/common/utils/tailwind'

import { TableCell } from './table'

interface SortableCellProps extends React.ComponentPropsWithoutRef<'td'> {
  children: React.ReactNode
  sortKey: string
  sort?: sortDto
  setSort: (sort: sortDto | undefined) => void
}

const SortAbleCell = (props: SortableCellProps) => {
  const { children, className, sortKey, sort, setSort, ...rest } = props
  return (
    <TableCell
      {...rest}
      className={cn('cursor-pointer', className)}
      onClick={() => {
        if (sort?.key == sortKey) {
          if (sort?.desc) {
            setSort({
              key: sortKey,
              desc: false,
            })
          } else {
            setSort(undefined)
          }
        } else {
          setSort({
            key: sortKey,
            desc: true,
          })
        }
      }}
    >
      {children}
      <FontAwesomeIcon
        icon={sort?.key == sortKey ? (sort?.desc ? faArrowUp : faArrowDown) : faArrowsUpDown}
        className="ml-1 h-3"
      />
    </TableCell>
  )
}

export default SortAbleCell

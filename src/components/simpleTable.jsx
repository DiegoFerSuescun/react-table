import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel,getFacetedRowModel,getFacetedUniqueValues,sortingFns, } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { makeData } from "./makeData";
import { faker } from '@faker-js/faker'
import moment from 'moment';
import { DatePicker, Space, Pagination  } from 'antd';
import './simpleTable.css';


const defaultColumn = {
  cell: ({getValue, row : {index}, column: {id}, table}) =>{

    if( id === 'progress'){
      const progressOptions = [10, 20, 30, 40, 50]; // Puedes personalizar las opciones

      const initialValue = getValue();
      const [value, setValue] = useState(initialValue);

      const onChange = (e) => {
        setValue(e.target.value);
        table.options.meta?.updateData(index, id, e.target.value);
      };

      return (
        <select value={value} onChange={onChange}>
          {progressOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    };
    if( id === 'status'){
      const progressOptions = ["complicated", "single", "relationship"]; // Puedes personalizar las opciones

      const initialValue = getValue();
      const [value, setValue] = useState(initialValue);

      const onChange = (e) => {
        setValue(e.target.value);
        table.options.meta?.updateData(index, id, e.target.value);
      };

      return (
        <select value={value} onChange={onChange}>
          {progressOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    };

    if (id === 'birthDate') {
      const initialValue = getValue();
      const [value, setValue] = useState(initialValue);

      const onChange = (e) => {
        const enteredDate = new Date(e.target.value);
        if (!isNaN(enteredDate.getTime())) {
          setValue(e.target.value);
          table.options.meta?.updateData(index, id, e.target.value);
        }
      };

      return (
        <div>
          <DatePicker
            value={value ? moment(value) : null}
            format="DD-MM-YYYY"
            onChange={onChange}
          />

        </div>
      );
    };

    const initialValue = getValue();
    const [ value, setValue ] = useState(initialValue) 

    const onBlur = () => {
      table.options.meta?.updateData(index, id, value)
    }
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return (
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
      />
    )
  }
};

function useSkipper() {
  const shouldSkipRef = useRef(true)
  const shouldSkip = shouldSkipRef.current

  const skip = useCallback(() => {
    shouldSkipRef.current = false
  }, [])

  useEffect(() => {
    shouldSkipRef.current = true
  })

  return [shouldSkip, skip]
}


function SimpleTable () {
  
    const rerender = () => setData(() => makeData(200));

    const [data, setData] = useState(() => makeData(200))
    // const [columns] = useState(() => [...defaultColumn])

    const [columnVisibility, setColumnVisibility] = useState({})
    const [columnOrder, setColumnOrder] = useState([])

    const [ sorting, setSorting ] = useState([]);
    const [ filtering, setFiltering] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [pageSize, setPageSize] = useState(15);

    const [error, setError] = useState("");
    const [isEditingEnabled, setIsEditingEnabled] = useState(true);
    
    //EditCeldas
    const columnss = useMemo(
      () => [
        {
          header: "Name",
          accessorKey: "firstName",
          footer: props => props.column.id,
        },
        {
          accessorFn: row => row.lastName,
          id: "lastName",
          header: () => <span>Last Name</span>,
          footer:props => props.column.id,
              
        },          
        {
          accessorKey: "age",
          header: () => "Age",
          footer: props => props.column.id
        },
        {
          accessorKey: "visits",
          header: "Visitas",
          footer: props => props.column.id
        },
        {
          accessorKey: "status",
          header: "Status",
          footer: props => props.column.id
        },
        {
          accessorKey: "progress",
          header: "Profile Progress",
          footer: props => props.column.id
        }, 
        {
          accessorKey: "birthDate",
          header: "Cumpleaños",
          footer: props => props.column.id
        }
      ]
    )

    const [ autoResetPageIndex, skipAutoresetPageIndex ] = useSkipper()

    //Filtro date

    const table = useReactTable({
        data,
        columns: columnss, autoResetPageIndex,
        defaultColumn,
        state: {
            columnVisibility,
            columnOrder,
            sorting,
            globalFilter: filtering,
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        getCoreRowModel: getCoreRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        getPaginationRowModel: getPaginationRowModel(), 
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        meta: {
          updateData: ( rowIndex, columnId, value) => {
            skipAutoresetPageIndex()
            const isValueEmpty = value === "" || value === null || value === undefined;
            if (isValueEmpty) {
              setError(`El campo ${columnId} no puede estar vacío.`);
              return;
            }
            setData(old => 
              old.map ((row, index) => {
                if(index === rowIndex){
                  return {
                    ...old[rowIndex],
                    [columnId]: value
                  }
                }
                return row
              })
              )
              setError("");
          }
        },
        pagination: {
          pageSize,
          pageIndex: 0, 
          pageCount: Math.ceil(data.length / pageSize),
          manualPagination: true,
        },
    });

    const onChangePage = (page) => {
      
      table.setPageIndex(page - 1);
      console.log("HOLAAAAA", page);
    };

    useEffect(() => {
      
      table.setPageSize(pageSize);
    }, [table, pageSize]);



    const filterByDate = useCallback(() => {
      if(startDate && endDate){
        const filteredData = makeData(200).filter((row) => {
          const rowDate = new Date(row.birthDate);
          const filterStartDate = new Date(startDate);
          const filterEndDate = new Date(endDate);

          return rowDate >= filterStartDate && rowDate <= filterEndDate
        })
        setData(filteredData)
        table.setPageIndex(0);
       }
    }, [startDate, endDate, setData, table] )
    

    return (
        <div>
            //Esta funcion nos permite seleccionar todas las columnas o hacer que no se vean 
            <div>
            <input type="text" 
            value={filtering}
            onChange={e=> setFiltering(e.target.value)}
            />

            <label>
            <input
              {...{
                type: "checkbox",
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler()
              }}
            />{" "}
            Toggle All
          </label>
            </div>

            //Esta funcion deja seleccionar ciertas columnas que se deseen o no sean visibles
            {table.getAllLeafColumns().map(column => {
          return (
            <div key={column.id} className="px-1">
              <label>
                <input
                  {...{
                    type: "checkbox",
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler()
                  }}
                />{" "}
                {column.id}
              </label>
            </div>
          )
        })}
        //Desorganiza las columnas el boton shuffle y reordena el mismo array pero en una manera diferente 
        {/* <div className="flex flex-wrap gap-2">
                <button onClick={() => rerender()} className="border p-1">
                Regenerate
                </button>
                <button onClick={() => randomizeColumns()} className="border p-1">
                Shuffle Columns
                </button>
        </div> */}

        <div>
        <label>Inicio </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label> Fin </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button type="button" onClick={filterByDate}>Apply Date Filter</button>
        </div>
        <div>
        <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              table.setPageSize(Number(e.target.value));
            }}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            
          </select>
        </div>
            <table>
                <thead>
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => (
                                        <th key={header.id}
                                        colSpan={header.colSpan}
                                        className={`column-${header.id}`}
                                        onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {header.isPlaceholder? null :(
                                                <div>
                                                    {flexRender(header.column.columnDef.header,
                                                    header.getContext()
                                                    )}
                                                    {
                                                        {asc: "🔼" , desc : "🔽"}[header.column.getIsSorted() ?? null ]
                                                    }
                                                </div>
                                            )}
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody>
                    {
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {
                                    row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            { 
                                                <div>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            }
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                  {
                    table.getFooterGroups().map(footerGroup => (
                        <tr key={footerGroup.id}>
                            {
                                footerGroup.headers.map(footer => (
                                    <th key={footer.id}>
                                        {
                                            flexRender(footer.column.columnDef.footer, footer.getContext())
                                        }
                                    </th>
                                ))
                            }
                        </tr>
                    ))
                  }
                </tfoot>
            </table>
            <div>
              <Pagination
                defaultCurrent={0}
                onChange={onChangePage}    
                total={200}
                defaultPageSize={15}
              />

            </div>

            <div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            {/* <button type="button" onClick={() => table.setPageIndex(0)}>Primer página</button>
            <button type="button" onClick={() => table.previousPage()}>Página anterior</button>
            <button type="button" onClick={() => table.nextPage()}>Página siguiente</button>
            <button type="button" onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
              Última página
            </button> */}
           
        </div>
    )
}

export default SimpleTable;
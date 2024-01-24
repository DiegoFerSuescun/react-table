import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { useState } from "react";

function SimpleTable ({data, columns}) {
    
    const [ sorting, setSorting ] = useState([]);
    const [ filtering, setFiltering] = useState("");
    const [editingCell, setEditingCell] = useState(null); 
  const [editedValue, setEditedValue] = useState("");
   
    const table = useReactTable({
        data,
        columns, 
        getCoreRowModel: getCoreRowModel(), 
        getPaginationRowModel: getPaginationRowModel(), 
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter: filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    })
    const handleCellEdit = (cell) => {
        setEditingCell(cell);
        setEditedValue(cell.value);
      };

      const applyEdit = () => {
        if (editingCell) {

          const updatedData = data.map((row) =>
            row.id === editingCell.row.id
              ? { ...row, [editingCell.column.id]: editedValue }
              : row
          );
          setEditingCell(null);
          setEditedValue("");
          table.setData(updatedData);
        }
      };
    return (
        <div>
            <input type="text" 
            value={filtering}
            onChange={e=> setFiltering(e.target.value)}
            />
            <table>
                <thead>
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => (
                                        <th key={header.id}
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
                                        <td key={cell.column.id}>
                                            { editingCell === cell ? (
                                                <>
                                                <input type="text" value={editedValue} onChange={(e) => setEditedValue(e.target.value)} />
                                                <button onClick={applyEdit}>Guardar</button>
                                                </>
                                            ): (
                                                <div onClick={() => handleCellEdit(cell)}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}

                                                </div>
                                            )}
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
            <button onClick={() => table.setPageIndex(0)}>primer pagina</button>
            <button onClick={() => table.previousPage()}>pagina anterior</button>
            <button onClick={() => table.nextPage()}>pagina siguiente</button>
            <button onClick={() => table.setPageIndex(table.getPageCount()-1)}>Ultima pagina</button>
        </div>
    )
}

export default SimpleTable;
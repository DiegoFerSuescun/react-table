import SimpleTable from "./components/simpleTable"
import data from "./MOCK_DATA.json";
import dayjs from 'dayjs'

function App (){

  const columns = [
    {
        header: "Propiedad ID",
        accessorKey: 'id',
        footer: 'Mi Id'
    },
    {
        header: 'Nombres completos',
        columns: [
            {
                header: "Name",
                accessorKey: 'first_name',
                footer: 'Mi Nombre'
            },
            {
                header: "Lastname",
                accessorKey: 'lastname',
                footer: 'Mi apellido'
            }
        ]
    },
    // {
    //     header: 'Nombres y apellidos',
    //     accessorFn : row => `${row.first_name} ${row.lastname}` 
    // },
    // {
    //     header: "Name",
    //     accessorKey: 'first_name',
    //     footer: 'Mi Nombre'
    // },
    // {
    //     header: "Lastname",
    //     accessorKey: 'lastname',
    //     footer: 'Mi apellido'
    // },
    {
        header: "Email",
        accessorKey: 'email',
        footer: 'Mi Email'
    },
    {
        header: "Country",
        accessorKey: 'country',
        footer: 'Mi Pais'
    },
    {
        header: "Day of Birth",
        accessorKey: 'dateofbirth',
        footer: 'Mi fecha de nacimiento',
        cell: info => dayjs(info.getValue()). format('DD/MM/YYYY')
    },
];

  return(
    <div>
      <SimpleTable
      data = {data}
      columns= {columns}
      />
    </div>
  )
};

export default App
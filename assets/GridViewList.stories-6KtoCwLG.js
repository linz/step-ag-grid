import{j as e}from"./index-_eCCCJMN.js";/* empty css                  */import{G as p,a as m}from"./GridUpdatingContextProvider-DK2uKtWm.js";import"./stateDeferredHook-9sbfsEJK.js";import{r}from"./index-ne9I_3bB.js";import{G as o}from"./Grid-BnijaEma.js";import{G as s,a as f}from"./GridWrapper-DVhisWkQ.js";import"./util-DX3mDqFH.js";import"./ActionButton-CwNE6oAT.js";import"./index-JPfhvaY4.js";const T={title:"Components / Grids",component:o,parameters:{docs:{source:{type:"code"}}},decorators:[n=>e.jsx("div",{style:{maxWidth:1024,height:400,display:"flex",flexDirection:"column"},children:e.jsx(p,{children:e.jsx(m,{children:e.jsx(n,{})})})})]},h=n=>{const[a,l]=r.useState([]),d=r.useMemo(()=>[s({field:"id",headerName:"Id",lockVisible:!0,resizable:!1,lockPosition:"left",cellRenderer:({value:t})=>e.jsx("a",{href:"#",children:t})}),s({field:"position",headerName:"Position",resizable:!1,lockPosition:"left",cellRendererParams:{warning:({value:t})=>t==="Tester"&&"Testers are testing",info:({value:t})=>t==="Developer"&&"Developers are awesome"}}),s({field:"desc",headerName:"Description",resizable:!1,lockPosition:"left"}),s({field:"age",headerName:"Age",resizable:!1,lockPosition:"left"}),s({field:"height",headerName:"Height",resizable:!1,lockPosition:"left"})],[]),[c]=r.useState([{id:1e3,position:"Tester",age:30,height:`6'4"`,desc:"Tests application",dd:"1"},{id:1001,position:"Developer",age:12,height:`5'3"`,desc:"Develops application",dd:"2"},{id:1002,position:"Manager",age:65,height:`5'9"`,desc:"Manages",dd:"3"}]);return e.jsx(f,{maxHeight:400,children:e.jsx(o,{"data-testid":"readonly",...n,selectable:!1,rowSelection:"single",externalSelectedItems:a,setExternalSelectedItems:l,columnDefs:d,rowData:c,sizeColumns:"fit",theme:"ag-theme-step-view-list-default",contextMenuSelectRow:!1,suppressCellFocus:!0})})},i=h.bind({});i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell<ITestRow, ITestRow['id']>({
    field: 'id',
    headerName: 'Id',
    lockVisible: true,
    resizable: false,
    lockPosition: 'left',
    cellRenderer: ({
      value
    }) => <a href={'#'}>{value}</a>
  }), GridCell<ITestRow, ITestRow['position']>({
    field: 'position',
    headerName: 'Position',
    resizable: false,
    lockPosition: 'left',
    cellRendererParams: {
      warning: ({
        value
      }) => value === 'Tester' && 'Testers are testing',
      info: ({
        value
      }) => value === 'Developer' && 'Developers are awesome'
    }
  }), GridCell({
    field: 'desc',
    headerName: 'Description',
    resizable: false,
    lockPosition: 'left'
  }), GridCell({
    field: 'age',
    headerName: 'Age',
    resizable: false,
    lockPosition: 'left'
  }), GridCell({
    field: 'height',
    headerName: 'Height',
    resizable: false,
    lockPosition: 'left'
  })], []);
  const [rowData] = useState<ITestRow[]>([{
    id: 1000,
    position: 'Tester',
    age: 30,
    height: \`6'4"\`,
    desc: 'Tests application',
    dd: '1'
  }, {
    id: 1001,
    position: 'Developer',
    age: 12,
    height: \`5'3"\`,
    desc: 'Develops application',
    dd: '2'
  }, {
    id: 1002,
    position: 'Manager',
    age: 65,
    height: \`5'9"\`,
    desc: 'Manages',
    dd: '3'
  }]);
  return <GridWrapper maxHeight={400}>
      <Grid data-testid={'readonly'} {...props} selectable={false} rowSelection={'single'} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} sizeColumns={'fit'} theme={'ag-theme-step-view-list-default'} contextMenuSelectRow={false} suppressCellFocus={true} />
    </GridWrapper>;
}`,...i.parameters?.docs?.source}}};const b=["ListViewGrid"];export{i as ListViewGrid,b as __namedExportsOrder,T as default};

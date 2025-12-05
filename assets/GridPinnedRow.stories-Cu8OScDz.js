import{j as e}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as o}from"./iframe-fuNulc0f.js";import{G as i,c as m}from"./GridWrapper-BAUk9ZaG.js";import{G as t}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as l,a as c}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as g}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const C={title:"Components / Grids",component:t,args:{selectable:!1},parameters:{docs:{source:{type:"code"}}},decorators:[a=>e.jsx("div",{style:{maxWidth:1024,height:260,display:"flex",flexDirection:"column"},children:e.jsx(l,{children:e.jsx(c,{children:e.jsx(a,{})})})})]},D=a=>{const r=o.useMemo(()=>[i({field:"name",headerName:"Name"}),i({field:"position",headerName:"Position"}),i({field:"age",headerName:"Age"})],[]),[s]=o.useState([{id:1,name:"Opeyemi",position:"Tester",age:30},{id:2,name:"Johnie",position:"Developer",age:21},{id:3,name:"Laxmi",position:"Manager",age:65},{id:4,name:"Salama",position:"Developer",age:22},{id:5,name:"Husni",position:"Developer",age:24}]),[d]=o.useState([{name:"Total Age",position:"",age:170}]),[p]=o.useState([{name:"Min Age",position:"",age:21}]);return e.jsx(m,{maxHeight:400,children:e.jsx(t,{"data-testid":"readonly",...a,selectable:!1,columnDefs:r,rowData:s,pinnedTopRowData:p,pinnedBottomRowData:d})})},n=D.bind({});n.play=g;n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'name',
    headerName: 'Name'
  }), GridCell({
    field: 'position',
    headerName: 'Position'
  }), GridCell({
    field: 'age',
    headerName: 'Age'
  })], []);
  const [rowData] = useState<ITestRow[]>([{
    id: 1,
    name: 'Opeyemi',
    position: 'Tester',
    age: 30
  }, {
    id: 2,
    name: 'Johnie',
    position: 'Developer',
    age: 21
  }, {
    id: 3,
    name: 'Laxmi',
    position: 'Manager',
    age: 65
  }, {
    id: 4,
    name: 'Salama',
    position: 'Developer',
    age: 22
  }, {
    id: 5,
    name: 'Husni',
    position: 'Developer',
    age: 24
  }]);
  const [pinnedBottomRowData] = useState<ITestPinnedRow[]>([{
    name: 'Total Age',
    position: '',
    age: 170
  }]);
  const [pinnedTopRowData] = useState<ITestPinnedRow[]>([{
    name: 'Min Age',
    position: '',
    age: 21
  }]);
  return <GridWrapper maxHeight={400}>
      <Grid data-testid={'readonly'} {...props} selectable={false} columnDefs={columnDefs} rowData={rowData} pinnedTopRowData={pinnedTopRowData} pinnedBottomRowData={pinnedBottomRowData} />
    </GridWrapper>;
}`,...n.parameters?.docs?.source}}};const N=["PinnedRow"];export{n as PinnedRow,N as __namedExportsOrder,C as default};

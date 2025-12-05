import{j as r}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as n}from"./iframe-fuNulc0f.js";import{G as o,c as u}from"./GridWrapper-BAUk9ZaG.js";import{G as d}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as w,a as h}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as f}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const I={title:"Components / Grids",component:d,args:{quickFilter:!0,quickFilterValue:"",quickFilterPlaceholder:"Quick filter...",selectable:!1,rowSelection:"single"},parameters:{docs:{source:{type:"code"}}},decorators:[t=>r.jsx("div",{style:{maxWidth:1024,height:400,display:"flex",flexDirection:"column"},children:r.jsx(w,{children:r.jsx(h,{children:r.jsx(t,{})})})})]},D=t=>{const l=n.useMemo(()=>[o({field:"id",headerName:"Id",lockVisible:!0}),o({field:"position",headerName:"Position",cellRendererParams:{warning:({value:e})=>e==="Tester"&&"Testers are testing",info:({value:e})=>e==="Developer"&&"Developers are awesome"}}),o({field:"age",headerName:"Age"}),o({field:"height",headerName:"Height"}),o({field:"desc",headerName:"Description",flex:1})],[]),[p,c]=n.useState([{id:1e3,position:"Tester",age:30,height:`6'4"`,desc:"Tests application",dd:"1"},{id:1001,position:"Developer",age:12,height:`5'3"`,desc:"Develops application",dd:"2"},{id:1002,position:"Manager",age:65,height:`5'9"`,desc:"Manages",dd:"3"},{id:1003,position:"BA",age:42,height:`5'7"`,desc:"BAs",dd:"4"}]),m=n.useCallback(({movedRow:e,targetRow:s})=>{c(g=>g.map(a=>a.id===e.id?s:a.id===s.id?e:a))},[]);return r.jsx(u,{maxHeight:300,children:r.jsx(d,{"data-testid":"readonly",...t,selectable:!0,rowSelection:"multiple",animateRows:!0,columnDefs:l,defaultColDef:{sortable:!1},rowData:p,onRowDragEnd:m,rowDragText:({rowNode:e})=>`${e?.data.id} - ${e?.data.position}`})})},i=D.bind({});i.play=f;i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id',
    lockVisible: true
  }), GridCell<ITestRow, ITestRow['position']>({
    field: 'position',
    headerName: 'Position',
    cellRendererParams: {
      warning: ({
        value
      }) => value === 'Tester' && 'Testers are testing',
      info: ({
        value
      }) => value === 'Developer' && 'Developers are awesome'
    }
  }), GridCell({
    field: 'age',
    headerName: 'Age'
  }), GridCell({
    field: 'height',
    headerName: 'Height'
  }), GridCell({
    field: 'desc',
    headerName: 'Description',
    flex: 1
  })], []);
  const [rowData, setRowData] = useState<ITestRow[]>([{
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
  }, {
    id: 1003,
    position: 'BA',
    age: 42,
    height: \`5'7"\`,
    desc: 'BAs',
    dd: '4'
  }]);
  const onRowDragEnd = useCallback(({
    movedRow,
    targetRow
  }: GridOnRowDragEndProps<ITestRow>) => {
    setRowData(rowData => rowData.map(r => {
      if (r.id === movedRow.id) return targetRow;
      if (r.id === targetRow.id) return movedRow;
      return r;
    }));
  }, []);
  return <GridWrapper maxHeight={300}>
      <Grid data-testid={'readonly'} {...props} selectable={true} rowSelection="multiple" animateRows={true} columnDefs={columnDefs} defaultColDef={{
      sortable: false
    }} rowData={rowData} onRowDragEnd={onRowDragEnd} rowDragText={({
      rowNode
    }) => \`\${rowNode?.data.id} - \${rowNode?.data.position}\`} />
    </GridWrapper>;
}`,...i.parameters?.docs?.source}}};const y=["DragRowSingleSelection"];export{i as DragRowSingleSelection,y as __namedExportsOrder,I as default};

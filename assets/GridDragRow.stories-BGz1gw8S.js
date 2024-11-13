import{j as r}from"./jsx-runtime-DEdD30eg.js";/* empty css                  */import{G as m,a as g}from"./GridUpdatingContextProvider-CLl46RM8.js";import"./stateDeferredHook-DIITot2w.js";import{r as d}from"./index-RYns6xqu.js";import{G as i,a as u}from"./GridWrapper-DSHsENPw.js";import{G as l}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import"./util-CWqzvxZb.js";import"./ActionButton-BnaFCZwL.js";import{w as h}from"./storybookTestUtil-CYGWFEhE.js";import"./index-8uelxQvJ.js";const P={title:"Components / Grids",component:l,args:{quickFilter:!0,quickFilterValue:"",quickFilterPlaceholder:"Quick filter...",selectable:!1,rowSelection:"single"},parameters:{docs:{source:{type:"code"}}},decorators:[a=>r.jsx("div",{style:{maxWidth:1024,height:400,display:"flex",flexDirection:"column"},children:r.jsx(m,{children:r.jsx(g,{children:r.jsx(a,{})})})})]},f=a=>{const p=d.useMemo(()=>[i({field:"id",headerName:"Id",lockVisible:!0}),i({field:"position",headerName:"Position",cellRendererParams:{warning:({value:e})=>e==="Tester"&&"Testers are testing",info:({value:e})=>e==="Developer"&&"Developers are awesome"}}),i({field:"age",headerName:"Age"}),i({field:"height",headerName:"Height"}),i({field:"desc",headerName:"Description",flex:1})],[]),[n,c]=d.useState([{id:1e3,position:"Tester",age:30,height:`6'4"`,desc:"Tests application",dd:"1"},{id:1001,position:"Developer",age:12,height:`5'3"`,desc:"Develops application",dd:"2"},{id:1002,position:"Manager",age:65,height:`5'9"`,desc:"Manages",dd:"3"},{id:1003,position:"BA",age:42,height:`5'7"`,desc:"BAs",dd:"4"}]);return r.jsx(u,{maxHeight:300,children:r.jsx(l,{"data-testid":"readonly",...a,selectable:!0,rowSelection:"multiple",animateRows:!0,columnDefs:p,defaultColDef:{sortable:!1},rowData:n,onRowDragEnd:async(e,s,w)=>{c(n.map(o=>o.id===e.id?s:o.id===s.id?e:o))},rowDragText:({rowNode:e})=>`${e?.data.id} - ${e?.data.position}`})})},t=f.bind({});t.play=h;t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: "id",
    headerName: "Id",
    lockVisible: true
  }), GridCell<ITestRow, ITestRow["position"]>({
    field: "position",
    headerName: "Position",
    cellRendererParams: {
      warning: ({
        value
      }) => value === "Tester" && "Testers are testing",
      info: ({
        value
      }) => value === "Developer" && "Developers are awesome"
    }
  }), GridCell({
    field: "age",
    headerName: "Age"
  }), GridCell({
    field: "height",
    headerName: "Height"
  }), GridCell({
    field: "desc",
    headerName: "Description",
    flex: 1
  })], []);
  const [rowData, setRowData] = useState([{
    id: 1000,
    position: "Tester",
    age: 30,
    height: \`6'4"\`,
    desc: "Tests application",
    dd: "1"
  }, {
    id: 1001,
    position: "Developer",
    age: 12,
    height: \`5'3"\`,
    desc: "Develops application",
    dd: "2"
  }, {
    id: 1002,
    position: "Manager",
    age: 65,
    height: \`5'9"\`,
    desc: "Manages",
    dd: "3"
  }, {
    id: 1003,
    position: "BA",
    age: 42,
    height: \`5'7"\`,
    desc: "BAs",
    dd: "4"
  }]);
  return <GridWrapper maxHeight={300}>
      <Grid data-testid={"readonly"} {...props} selectable={true} rowSelection="multiple" animateRows={true} columnDefs={columnDefs} defaultColDef={{
      sortable: false
    }} rowData={rowData} onRowDragEnd={async (movedRow, targetRow, _targetIndex) => {
      setRowData(rowData.map(r => {
        if (r.id === movedRow.id) return targetRow;
        if (r.id === targetRow.id) return movedRow;
        return r;
      }));
    }} rowDragText={({
      rowNode
    }) => \`\${rowNode?.data.id} - \${rowNode?.data.position}\`} />
    </GridWrapper>;
}`,...t.parameters?.docs?.source}}};const I=["DragRowSingleSelection"];export{t as DragRowSingleSelection,I as __namedExportsOrder,P as default};

import{j as e}from"./jsx-runtime-DEdD30eg.js";/* empty css                  */import{G as g,a as p}from"./GridUpdatingContextProvider-C0OJ_AZp.js";import"./stateDeferredHook-DIITot2w.js";import{r as a}from"./index-RYns6xqu.js";import{G as u,a as b,b as G,c as f,g as x,h as C}from"./GridWrapper-y58xtKL0.js";import{G as t}from"./Grid-osFtHP2O.js";import"./index-DYmNCwer.js";import{w}from"./util-CWqzvxZb.js";import{G as E,a as h}from"./GridPopoverEditBearing-DEaK51Ri.js";import"./ActionButton-BnaFCZwL.js";import{w as v}from"./storybookTestUtil-CYGWFEhE.js";import"./index-8uelxQvJ.js";const O={title:"Components / Grids",component:t,args:{quickFilterValue:"",selectable:!0,alwaysShowVerticalScroll:!1},decorators:[i=>e.jsx("div",{style:{width:1024,height:400},children:e.jsx(g,{children:e.jsx(p,{children:e.jsx(i,{})})})})]},S=i=>{const[o,s]=a.useState([]),d=a.useMemo(()=>[u({field:"id",headerName:"Id"}),E({field:"bearingCorrection",headerName:"Bearing correction",cellRendererParams:{warning:({data:r})=>r?.id==1002&&"Testers are testing",info:({data:r})=>r?.id==1001&&"Developers are developing"}},{multiEdit:!1}),h({field:"bearing",headerName:"Bearing"},{editorParams:{onSave:async({selectedRows:r,value:c})=>(await w(1e3),r.forEach(m=>m.bearing=c),!0)}})],[]),[l]=a.useState([{id:1e3,bearing:1.234,bearingCorrection:null},{id:1001,bearing:"0E-12",bearingCorrection:240},{id:1002,bearing:null,bearingCorrection:355.1},{id:1003,bearing:null,bearingCorrection:0},{id:1004,bearing:5,bearingCorrection:"1.00500"},{id:1005,bearing:null,bearingCorrection:"0E-12"}]);return e.jsxs(b,{maxHeight:300,children:[e.jsxs(G,{children:[e.jsx(f,{}),e.jsx(x,{}),e.jsx(C,{fileName:"customFilename"})]}),e.jsx(t,{"data-testid":"bearingsTestTable",...i,readOnly:!1,externalSelectedItems:o,setExternalSelectedItems:s,columnDefs:d,rowData:l,domLayout:"autoHeight"})]})},n=S.bind({});n.play=v;n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: "id",
    headerName: "Id"
  }), GridPopoverEditBearingCorrection({
    field: "bearingCorrection",
    headerName: "Bearing correction",
    cellRendererParams: {
      warning: ({
        data
      }) => data?.id == 1002 && "Testers are testing",
      info: ({
        data
      }) => data?.id == 1001 && "Developers are developing"
    }
  }, {
    multiEdit: false
  }), GridPopoverEditBearing({
    field: "bearing",
    headerName: "Bearing"
  }, {
    editorParams: {
      onSave: async ({
        selectedRows,
        value
      }) => {
        await wait(1000);
        selectedRows.forEach(row => row["bearing"] = value);
        return true;
      }
    }
  })], []);
  const [rowData] = useState([{
    id: 1000,
    bearing: 1.234,
    bearingCorrection: null
  }, {
    id: 1001,
    bearing: "0E-12",
    bearingCorrection: 240
  }, {
    id: 1002,
    bearing: null,
    bearingCorrection: 355.1
  }, {
    id: 1003,
    bearing: null,
    bearingCorrection: 0
  }, {
    id: 1004,
    bearing: 5.0,
    bearingCorrection: "1.00500"
  }, {
    id: 1005,
    bearing: null,
    bearingCorrection: "0E-12"
  }] as ITestRow[]);
  return <GridWrapper maxHeight={300}>
      <GridFilters>
        <GridFilterQuick />
        <GridFilterColumnsToggle />
        <GridFilterDownloadCsvButton fileName={"customFilename"} />
      </GridFilters>
      <Grid data-testid={"bearingsTestTable"} {...props} readOnly={false} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={"autoHeight"} />
    </GridWrapper>;
}`,...n.parameters?.docs?.source}}};const W=["_GridPopoverEditBearing"];export{n as _GridPopoverEditBearing,W as __namedExportsOrder,O as default};

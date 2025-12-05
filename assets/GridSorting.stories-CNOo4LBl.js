import{j as n,p as u,w as C}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as l}from"./iframe-fuNulc0f.js";import{G as o,c as f}from"./GridWrapper-BAUk9ZaG.js";import{G as S}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as b,a as h}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as G,a as v,c as g,g as p}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const{expect:x}=__STORYBOOK_MODULE_TEST__,P={title:"Components / Grids",component:S,args:{quickFilter:!0,quickFilterValue:"",quickFilterPlaceholder:"Quick filter...",selectable:!1,rowSelection:"single"},parameters:{docs:{source:{type:"code"}}},decorators:[r=>n.jsx("div",{style:{maxWidth:1024,height:400,display:"flex",flexDirection:"column"},children:n.jsx(b,{children:n.jsx(h,{children:n.jsx(r,{})})})})]},N=r=>{const[a,e]=l.useState([]),i=l.useMemo(()=>[o({field:"id",headerName:"Id",lockVisible:!0}),o({field:"numeric",headerName:"Numeric"}),o({field:"text",headerName:"Text"}),o({colId:"customComparatorText",headerName:"Cust. comp. id as text",valueFormatter:({data:t})=>t?.text??"",comparator:(t,w,m,s)=>u(String(m.data?.id),String(s.data?.id))??0}),o({colId:"customComparatorNumeric",headerName:"Cust. comp. abs number",valueFormatter:({data:t})=>String(t?.numeric??""),comparator:(t,w,m,s)=>u(m.data?.numeric,s.data?.numeric)??0})],[]),[c]=l.useState([{id:1009,numeric:-1.1,text:"ade"},{id:1e3,numeric:1,text:"ade"},{id:1001,numeric:11,text:"cdc"},{id:1002,numeric:21,text:"2"},{id:1003,numeric:2.1,text:"10"},{id:1004,numeric:2.01,text:"b"},{id:1005,numeric:2.21,text:"b"},{id:1006,numeric:3,text:void 0},{id:1008,numeric:3,text:"e"},{id:1007,numeric:void 0,text:"e"}]);return n.jsx(f,{maxHeight:400,children:n.jsx(S,{"data-testid":"readonly",...r,selectable:!0,enableClickSelection:!0,enableSelectionWithoutKeys:!0,autoSelectFirstRow:!0,externalSelectedItems:a,setExternalSelectedItems:e,columnDefs:i,rowData:c})})},d=N.bind({});d.play=async r=>{const{canvasElement:a}=r;await G(r),await v({grid:a});const e=async(i,c,t)=>{i!==null&&(await g(i,a),await C(500),c&&x(p(i,a)).toEqual(c)),t&&x(p("id",a)).toEqual(t)};await e(null,null,["1009","1000","1001","1002","1003","1004","1005","1006","1008","1007"]),await e("numeric",["–","-1.1","1","2.01","2.1","2.21","3","3","11","21"]),await e("numeric",["21","11","3","3","2.21","2.1","2.01","1","-1.1","–"]),await e("text",["–","2","10","ade","ade","b","b","cdc","e","e"],["1006","1002","1003","1000","1009","1004","1005","1001","1007","1008"]),await e("text",["e","e","cdc","b","b","ade","ade","10","2","–"],["1008","1007","1001","1005","1004","1009","1000","1003","1002","1006"]),await e("customComparatorText",null,["1000","1001","1002","1003","1004","1005","1006","1007","1008","1009"]),await e("customComparatorText",null,["1009","1008","1007","1006","1005","1004","1003","1002","1001","1000"]),await e("customComparatorNumeric",["–","-1.1","1","2.01","2.1","2.21","3","3","11","21"]),await e("customComparatorNumeric",["21","11","3","3","2.21","2.1","2.01","1","-1.1","–"])};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id',
    lockVisible: true
  }), GridCell({
    field: 'numeric',
    headerName: 'Numeric'
  }), GridCell({
    field: 'text',
    headerName: 'Text'
  }), GridCell({
    colId: 'customComparatorText',
    headerName: 'Cust. comp. id as text',
    valueFormatter: ({
      data
    }) => data?.text ?? '',
    comparator: (_v1, _v2, n1, n2) => compareNaturalInsensitive(String(n1.data?.id), String(n2.data?.id)) ?? 0
  }), GridCell({
    colId: 'customComparatorNumeric',
    headerName: 'Cust. comp. abs number',
    valueFormatter: ({
      data
    }) => String(data?.numeric ?? ''),
    comparator: (_v1, _v2, n1, n2) => {
      return compareNaturalInsensitive(n1.data?.numeric, n2.data?.numeric) ?? 0;
    }
  })], []);
  const [rowData] = useState<ITestRow[]>([{
    id: 1009,
    numeric: -1.1,
    text: 'ade'
  }, {
    id: 1000,
    numeric: 1,
    text: 'ade'
  }, {
    id: 1001,
    numeric: 11,
    text: 'cdc'
  }, {
    id: 1002,
    numeric: 21,
    text: '2'
  }, {
    id: 1003,
    numeric: 2.1,
    text: '10'
  }, {
    id: 1004,
    numeric: 2.01,
    text: 'b'
  }, {
    id: 1005,
    numeric: 2.21,
    text: 'b'
  }, {
    id: 1006,
    numeric: 3,
    text: undefined
  }, {
    id: 1008,
    numeric: 3,
    text: 'e'
  }, {
    id: 1007,
    numeric: undefined,
    text: 'e'
  }]);
  return <GridWrapper maxHeight={400}>
      <Grid data-testid={'readonly'} {...props} selectable={true} enableClickSelection={true} enableSelectionWithoutKeys={true} autoSelectFirstRow={true} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} />
    </GridWrapper>;
}`,...d.parameters?.docs?.source}}};const V=["Sorting"];export{d as Sorting,V as __namedExportsOrder,P as default};

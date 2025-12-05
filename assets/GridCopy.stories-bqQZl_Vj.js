import{j as e,L as g}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as s}from"./iframe-fuNulc0f.js";import{G as n,a as G,b as f,c as x,d as v,e as C,f as w,g as T}from"./GridWrapper-BAUk9ZaG.js";import{G as c}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as S}from"./GridPopoverEditBearing-yDM-0OA5.js";import{G as F,a as y}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as b}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";class R{value;constructor(r){this.value=r%2147483647}next(r){this.value=this.value*16807%2147483647;const o=(this.value-1)/2147483646;return r==null?o:(o*(r+1)|0)%(r+1)}fromArray(r){return r[this.next(r.length-1)]}}const q={title:"Components / Grids",component:c,args:{quickFilter:!0,quickFilterValue:"",quickFilterPlaceholder:"Quick filter...",selectable:!1,rowSelection:"multiple"},parameters:{docs:{source:{type:"code"}}},decorators:[a=>e.jsx(g,{version:"v2",children:e.jsx("div",{style:{maxWidth:1024,height:"80vh",display:"flex",flexDirection:"column"},children:e.jsx(F,{children:e.jsx(y,{children:e.jsx(a,{})})})})})]},D=a=>{const[r,o]=s.useState([]),u=s.useMemo(()=>[n({field:"id",headerName:"Id",lockVisible:!0}),n({field:"position",headerName:"Position",cellRendererParams:{error:({value:t})=>t==="Manager"&&"Managers need management",warning:({value:t})=>t==="Tester"&&"Testers are testing",info:({value:t})=>t==="Developer"&&"Developers are awesome"}}),{headerName:"Metrics",marryChildren:!0,children:[n({field:"age",headerName:"Age"}),n({field:"height",headerName:"Height"})]},n({field:"bearing",headerName:"Bearing",valueFormatter:S}),G(),f({},{editorParams:{options:()=>[{label:"Test menu",action:()=>{}}]}})],[]),[m]=s.useState(()=>{const t=new R(1e3);let p=1e3;const h=[void 0,"Tester","Developer","Lawyer",'Barrista """',"Manager","CEO","CTO","Architect"],l=[];for(let d=0;d<1e3;d++)l.push({id:p++,position:t.fromArray(h),age:30,height:`${t.next(3)+3}'${t.next(12)}"`,bearing:t.next(36e4)/1e3});return l});return e.jsxs(x,{children:[e.jsxs(v,{children:[e.jsx(C,{}),e.jsx(w,{}),e.jsx(T,{fileName:"readOnlyGrid"})]}),e.jsx(c,{"data-testid":"readonly",...a,enableRangeSelection:!0,selectable:!0,enableClickSelection:!0,enableSelectionWithoutKeys:!0,autoSelectFirstRow:!0,externalSelectedIds:r,setExternalSelectedIds:o,columnDefs:u,rowData:m})]})},i=D.bind({});i.play=b;i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const [externalSelectedIds, setExternalSelectedIds] = useState<number[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id',
    lockVisible: true
  }), GridCell<ITestRow, ITestRow['position']>({
    field: 'position',
    headerName: 'Position',
    cellRendererParams: {
      error: ({
        value
      }) => value === 'Manager' && 'Managers need management',
      warning: ({
        value
      }) => value === 'Tester' && 'Testers are testing',
      info: ({
        value
      }) => value === 'Developer' && 'Developers are awesome'
    }
  }), {
    headerName: 'Metrics',
    marryChildren: true,
    children: [GridCell<ITestRow, ITestRow['age']>({
      field: 'age',
      headerName: 'Age'
    }), GridCell<ITestRow, ITestRow['height']>({
      field: 'height',
      headerName: 'Height'
    })]
  }, GridCell({
    field: 'bearing',
    headerName: 'Bearing',
    valueFormatter: GridCellBearingValueFormatter
  }), GridCellFiller(), GridPopoverMenu({}, {
    editorParams: {
      options: () => [{
        label: 'Test menu',
        action: () => {}
      }]
    }
  })], []);
  const [rowData] = useState<ITestRow[]>(() => {
    const random = new SeededRandomForTests(1000);
    let id = 1000;
    const positions = [undefined, 'Tester', 'Developer', 'Lawyer', 'Barrista """', 'Manager', 'CEO', 'CTO', 'Architect'];
    const result: ITestRow[] = [];
    for (let i = 0; i < 1000; i++) {
      result.push({
        id: id++,
        position: random.fromArray(positions),
        age: 30,
        height: \`\${random.next(3) + 3}'\${random.next(12)}"\`,
        bearing: random.next(360000) / 1000
      });
    }
    return result;
  });
  return <GridWrapper>
      <GridFilters>
        <GridFilterQuick />
        <GridFilterColumnsToggle />
        <GridFilterDownloadCsvButton fileName={'readOnlyGrid'} />
      </GridFilters>
      <Grid data-testid={'readonly'} {...props} enableRangeSelection={true} selectable={true} enableClickSelection={true} enableSelectionWithoutKeys={true} autoSelectFirstRow={true} externalSelectedIds={externalSelectedIds} setExternalSelectedIds={setExternalSelectedIds} columnDefs={columnDefs} rowData={rowData} />
    </GridWrapper>;
}`,...i.parameters?.docs?.source}}};const Q=["GridCopy"];export{i as GridCopy,Q as __namedExportsOrder,q as default};

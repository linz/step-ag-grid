import{j as e}from"./util-ijFjlinu.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Du3IBcJj.js";import{r as n}from"./iframe-DlkmCGKI.js";import{G as o,a as d,b as p,c,d as u}from"./GridWrapper-BPNz-Kwc.js";import{G as s}from"./Grid-x2Pv4IEw.js";import"./client-iOTQfKt-.js";import{G as m,a as g}from"./GridUpdatingContextProvider-BzZAfXqp.js";import"./ActionButton-Ch-xL9UL.js";import{w as f}from"./storybookTestUtil-D13wlVSp.js";import"./index-cvdpWsZ8.js";import"./preload-helper-PPVm8Dsz.js";const P={title:"Components / Grids",component:s,decorators:[t=>e.jsx("div",{style:{width:1024,height:400,display:"flex"},children:e.jsx(m,{children:e.jsx(g,{children:e.jsx(t,{})})})})]},h=t=>{const a=n.useMemo(()=>[o({field:"id",headerName:"Id"}),o({field:"position",headerName:"Position"}),o({field:"desc",headerName:"Description",flex:1})],[]),[l]=n.useState([{id:1e3,position:"Tester",age:30,desc:"Integration tester - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lectus neque. Nunc congue magna ut lorem pretium, vitae congue lorem malesuada. Etiam eget eleifend sapien, sed egestas felis. Aliquam ac augue sapien."},{id:1001,position:"Developer",age:12,desc:"Frontend developer"},{id:1002,position:"Manager",age:65,desc:"Technical Manager"},{id:1003,position:"Tester",age:30,desc:"E2E tester"},{id:1004,position:"Developer",age:12,desc:"Fullstack Developer"},{id:1005,position:"Developer",age:14,desc:"Backend Developer"},{id:1006,position:"Architect",age:30,desc:"Architect"}]);return e.jsxs(d,{children:[e.jsxs(p,{children:[e.jsx(c,{quickFilterPlaceholder:"Custom placeholder..."}),e.jsx(u,{luiButtonProps:{style:{whiteSpace:"nowrap"}},options:[{label:"All"},{label:"Developers",filter:r=>r.position==="Developer"},{label:"Testers",filter:r=>r.position==="Tester"}]})]}),e.jsx(s,{...t,rowSelection:"multiple",columnDefs:a,rowData:l,sizeColumns:"auto-skip-headers"})]})},i=h.bind({});i.play=f;i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridCell({
    field: 'position',
    headerName: 'Position'
  }), GridCell({
    field: 'desc',
    headerName: 'Description',
    flex: 1
  })], []);
  const [rowData] = useState([{
    id: 1000,
    position: 'Tester',
    age: 30,
    desc: 'Integration tester - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lectus neque. Nunc congue magna ut lorem pretium, vitae congue lorem malesuada. Etiam eget eleifend sapien, sed egestas felis. Aliquam ac augue sapien.'
  }, {
    id: 1001,
    position: 'Developer',
    age: 12,
    desc: 'Frontend developer'
  }, {
    id: 1002,
    position: 'Manager',
    age: 65,
    desc: 'Technical Manager'
  }, {
    id: 1003,
    position: 'Tester',
    age: 30,
    desc: 'E2E tester'
  }, {
    id: 1004,
    position: 'Developer',
    age: 12,
    desc: 'Fullstack Developer'
  }, {
    id: 1005,
    position: 'Developer',
    age: 14,
    desc: 'Backend Developer'
  }, {
    id: 1006,
    position: 'Architect',
    age: 30,
    desc: 'Architect'
  }]);
  return <GridWrapper>
      <GridFilters>
        <GridFilterQuick quickFilterPlaceholder={'Custom placeholder...'} />
        <GridFilterButtons<ITestRow> luiButtonProps={{
        style: {
          whiteSpace: 'nowrap'
        }
      }} options={[{
        label: 'All'
      }, {
        label: 'Developers',
        filter: row => row.position === 'Developer'
      }, {
        label: 'Testers',
        filter: row => row.position === 'Tester'
      }]} />
      </GridFilters>
      <Grid {...props} rowSelection={'multiple'} columnDefs={columnDefs} rowData={rowData} sizeColumns={'auto-skip-headers'} />
    </GridWrapper>;
}`,...i.parameters?.docs?.source}}};const A=["_FilterButtonsExample"];export{i as _FilterButtonsExample,A as __namedExportsOrder,P as default};

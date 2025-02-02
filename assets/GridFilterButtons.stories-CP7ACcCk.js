import{j as e}from"./index-_eCCCJMN.js";/* empty css                  */import{G as d,a as p}from"./GridUpdatingContextProvider-DK2uKtWm.js";import"./stateDeferredHook-9sbfsEJK.js";import{r as n}from"./index-ne9I_3bB.js";import{G as s}from"./Grid-BnijaEma.js";import{G as o,a as c,b as u,c as m,d as g}from"./GridWrapper-DVhisWkQ.js";import"./util-DX3mDqFH.js";import"./ActionButton-CwNE6oAT.js";import{w as f}from"./storybookTestUtil-B6V3sqEj.js";import"./index-JPfhvaY4.js";import"./index-DJy14G1K.js";const B={title:"Components / Grids",component:s,decorators:[r=>e.jsx("div",{style:{width:1024,height:400,display:"flex"},children:e.jsx(d,{children:e.jsx(p,{children:e.jsx(r,{})})})})]},h=r=>{const a=n.useMemo(()=>[o({field:"id",headerName:"Id"}),o({field:"position",headerName:"Position"}),o({field:"desc",headerName:"Description",flex:1})],[]),[l]=n.useState([{id:1e3,position:"Tester",age:30,desc:"Integration tester - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a lectus neque. Nunc congue magna ut lorem pretium, vitae congue lorem malesuada. Etiam eget eleifend sapien, sed egestas felis. Aliquam ac augue sapien."},{id:1001,position:"Developer",age:12,desc:"Frontend developer"},{id:1002,position:"Manager",age:65,desc:"Technical Manager"},{id:1003,position:"Tester",age:30,desc:"E2E tester"},{id:1004,position:"Developer",age:12,desc:"Fullstack Developer"},{id:1005,position:"Developer",age:12,desc:"Backend Developer"},{id:1006,position:"Architect",age:30,desc:"Architect"}]);return e.jsxs(c,{children:[e.jsxs(u,{children:[e.jsx(m,{quickFilterPlaceholder:"Custom placeholder..."}),e.jsx(g,{luiButtonProps:{style:{whiteSpace:"nowrap"}},options:[{label:"All"},{label:"Developers",filter:t=>t.position==="Developer"},{label:"Testers",filter:t=>t.position==="Tester"}]})]}),e.jsx(s,{...r,columnDefs:a,rowData:l,sizeColumns:"auto-skip-headers"})]})},i=h.bind({});i.play=f;i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`(props: GridProps) => {
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
    age: 12,
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
      <Grid {...props} columnDefs={columnDefs} rowData={rowData} sizeColumns={'auto-skip-headers'} />
    </GridWrapper>;
}`,...i.parameters?.docs?.source}}};const P=["_FilterButtonsExample"];export{i as _FilterButtonsExample,P as __namedExportsOrder,B as default};

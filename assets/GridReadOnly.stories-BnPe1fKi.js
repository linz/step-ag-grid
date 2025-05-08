import{j as t}from"./index-uvRZkhe0.js";/* empty css                  */import{G as h,a as g}from"./GridUpdatingContextProvider-DYGM_UmY.js";import"./stateDeferredHook-Dh_hbzWK.js";import{r as o}from"./index-DQDNmYQF.js";import{G as a,n as w,e as x,a as b,b as f,c as G,d as y,i as S,j as I,u as v,o as C,f as T,g as F}from"./GridWrapper-KGmbnRqr.js";import{G as p,M as R}from"./Grid-Cf9uaoEg.js";import{w as r}from"./util-CYV73bPB.js";import{G as D}from"./GridPopoverMessage-Qa-3wO-p.js";import"./ActionButton-BDYCoy1d.js";import{w as j}from"./storybookTestUtil-DBFt3sMW.js";import"./index-DYVtDik4.js";import"./index-BFcdsecu.js";const W={title:"Components / Grids",component:p,args:{quickFilter:!0,quickFilterValue:"",quickFilterPlaceholder:"Quick filter...",selectable:!1,rowSelection:"single"},parameters:{docs:{source:{type:"code"}}},decorators:[i=>t.jsx("div",{style:{maxWidth:1024,height:400,display:"flex",flexDirection:"column"},children:t.jsx(h,{children:t.jsx(g,{children:t.jsx(i,{})})})})]},O=i=>{const[l,d]=o.useState([]),c=o.useMemo(()=>[a({field:"id",headerName:"Id",lockVisible:!0}),a({field:"position",headerName:"Position",cellRendererParams:{warning:({value:e})=>e==="Tester"&&"Testers are testing",info:({value:e})=>e==="Developer"&&"Developers are awesome"}}),{headerName:"Metrics",marryChildren:!0,children:[a({field:"age",headerName:"Age"}),a({field:"height",headerName:"Height"})]},a({field:"desc",headerName:"Description",flex:1,initialHide:!0}),w(),D({headerName:"Popout message",cellRenderer:()=>t.jsx(t.Fragment,{children:"Single Click me!"}),exportable:!1},{multiEdit:!0,editorParams:{message:async e=>(await r(1e3),`There are ${e.length} row(s) selected`)}}),a({headerName:"Custom edit",editable:!0,flex:1,valueFormatter:()=>"Press E",cellRendererParams:{rightHoverElement:t.jsx(C,{icon:"ic_launch_modal",title:"Title text",className:"GridCell-editableIcon"}),editAction:e=>{alert(`Custom edit ${e.map(n=>n.id).join()} rowId(s) selected`)},shortcutKeys:{e:()=>{alert("Hi")}}}}),x({},{multiEdit:!0,editorParams:{defaultAction:({menuOption:e})=>{console.log("clicked",{menuOption:e})},options:async e=>(await r(500),[{label:"Single edit only",action:async({selectedRows:n})=>{alert(`Single-edit: ${n.map(m=>m.id).join()} rowId(s) selected`),await r(1500)},disabled:e.length>1},{label:"Multi-edit",action:async({selectedRows:n})=>{alert(`Multi-edit: ${n.map(m=>m.id).join()} rowId(s) selected`),await r(1500)}},{label:"Sub menu...",subMenu:()=>t.jsx(R,{children:"Find..."})},{label:"Disabled item",disabled:"Disabled for test"},{label:"Developer Only",hidden:e.some(n=>n.position!="Developer")},{label:"Other (TextInput)",action:async({menuOption:n})=>{console.log(`Sub selected value was ${JSON.stringify(n.subValue)}`),await r(500)},subComponent:()=>t.jsx(T,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})},{label:"Other (TextArea)",action:async({menuOption:n})=>{console.log(`Sub selected value was ${JSON.stringify(n.subValue)}`),await r(500)},subComponent:()=>t.jsx(F,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})}])}})],[]),[u]=o.useState([{id:1e3,position:"Tester",age:30,height:`6'4"`,desc:"Tests application",dd:"1"},{id:1001,position:"Developer",age:12,height:`5'3"`,desc:"Develops application",dd:"2"},{id:1002,position:"Manager",age:65,height:`5'9"`,desc:"Manages",dd:"3"}]);return t.jsxs(b,{maxHeight:400,children:[t.jsxs(f,{children:[t.jsx(G,{}),t.jsx(N,{text:"Age <",field:"age"}),t.jsx(y,{luiButtonProps:{style:{whiteSpace:"nowrap"}},options:[{label:"All"},{label:"< 30",filter:e=>e.age<30}]}),t.jsx(S,{}),t.jsx(I,{fileName:"readOnlyGrid"})]}),t.jsx(p,{"data-testid":"readonly",...i,selectable:!0,autoSelectFirstRow:!0,externalSelectedItems:l,setExternalSelectedItems:d,columnDefs:c,rowData:u})]})},N=i=>{const[l,d]=o.useState(),c=o.useCallback(e=>l==null||e[i.field]<l,[i.field,l]);v(c);const u=e=>{try{d(e.trim()==""?void 0:parseInt(e))}catch{}};return t.jsxs("div",{className:"GridFilter-container flex-row-center",children:[t.jsx("div",{style:{whiteSpace:"nowrap"},children:i.text})," ",t.jsx("input",{type:"text",defaultValue:l,onChange:e=>u(e.target.value),style:{width:64}})]})},s=O.bind({});s.play=j;s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
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
    field: 'desc',
    headerName: 'Description',
    flex: 1,
    initialHide: true
  }), GridCellFiller(), GridPopoverMessage({
    headerName: 'Popout message',
    cellRenderer: () => <>Single Click me!</>,
    exportable: false
  }, {
    multiEdit: true,
    editorParams: {
      message: async (selectedRows): Promise<string> => {
        await wait(1000);
        return \`There are \${selectedRows.length} row(s) selected\`;
      }
    }
  }), GridCell({
    headerName: 'Custom edit',
    editable: true,
    flex: 1,
    valueFormatter: () => 'Press E',
    cellRendererParams: {
      rightHoverElement: <GridIcon icon={'ic_launch_modal'} title={'Title text'} className={'GridCell-editableIcon'} />,
      editAction: (selectedRows: ITestRow[]) => {
        alert(\`Custom edit \${selectedRows.map(r => r.id).join()} rowId(s) selected\`);
      },
      shortcutKeys: {
        e: () => {
          alert('Hi');
        }
      }
    }
  }), GridPopoverMenu({}, {
    multiEdit: true,
    editorParams: {
      defaultAction: ({
        menuOption
      }) => {
        // eslint-disable-next-line no-console
        console.log('clicked', {
          menuOption
        });
      },
      options: async selectedItems => {
        // Just doing a timeout here to demonstrate deferred loading
        await wait(500);
        return [{
          label: 'Single edit only',
          action: async ({
            selectedRows
          }) => {
            alert(\`Single-edit: \${selectedRows.map(r => r.id).join()} rowId(s) selected\`);
            await wait(1500);
          },
          disabled: selectedItems.length > 1
        }, {
          label: 'Multi-edit',
          action: async ({
            selectedRows
          }) => {
            alert(\`Multi-edit: \${selectedRows.map(r => r.id).join()} rowId(s) selected\`);
            await wait(1500);
          }
        }, {
          label: 'Sub menu...',
          subMenu: () => <MenuItem>Find...</MenuItem>
        }, {
          label: 'Disabled item',
          disabled: 'Disabled for test'
        }, {
          label: 'Developer Only',
          hidden: selectedItems.some(x => x.position != 'Developer')
        }, {
          label: 'Other (TextInput)',
          action: async ({
            menuOption
          }) => {
            // eslint-disable-next-line no-console
            console.log(\`Sub selected value was \${JSON.stringify(menuOption.subValue)}\`);
            await wait(500);
          },
          subComponent: () => <GridFormSubComponentTextInput placeholder={'Other'} maxLength={5} required defaultValue={''} />
        }, {
          label: 'Other (TextArea)',
          action: async ({
            menuOption
          }) => {
            // eslint-disable-next-line no-console
            console.log(\`Sub selected value was \${JSON.stringify(menuOption.subValue)}\`);
            await wait(500);
          },
          subComponent: () => <GridFormSubComponentTextArea placeholder={'Other'} maxLength={5} required defaultValue={''} />
        }];
      }
    }
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
      <GridFilters>
        <GridFilterQuick />
        <GridFilterLessThan text="Age <" field={'age'} />
        <GridFilterButtons<ITestRow> luiButtonProps={{
        style: {
          whiteSpace: 'nowrap'
        }
      }} options={[{
        label: 'All'
      }, {
        label: '< 30',
        filter: row => row.age < 30
      }]} />
        <GridFilterColumnsToggle />
        <GridFilterDownloadCsvButton fileName={'readOnlyGrid'} />
      </GridFilters>
      <Grid data-testid={'readonly'} {...props} selectable={true} autoSelectFirstRow={true} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} />
    </GridWrapper>;
}`,...s.parameters?.docs?.source}}};const Q=["ReadOnlySingleSelection"];export{s as ReadOnlySingleSelection,Q as __namedExportsOrder,W as default};

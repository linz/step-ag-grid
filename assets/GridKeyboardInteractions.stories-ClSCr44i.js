import{j as o,w as n}from"./util-Do7DUC2X.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Ck7kUbYx.js";import{r as h}from"./iframe-fuNulc0f.js";import{G as p,b as y,y as C,i as T,j as E}from"./GridWrapper-BAUk9ZaG.js";import{G as v}from"./Grid-CF0nfSDW.js";import"./client-DUEhelG0.js";import{G as I}from"./GridPopoverMessage-Cwnsoja0.js";import{G}from"./GridPopoverTextArea-C2apFZQU.js";import{G as S,a as k}from"./GridUpdatingContextProvider-B4NLo6bu.js";import"./ActionButton-DT6uCTh5.js";import{w as D}from"./storybookTestUtil-CrgKzGmM.js";import"./index-BhY01m7I.js";import"./preload-helper-PPVm8Dsz.js";const{expect:a,within:O}=__STORYBOOK_MODULE_TEST__,{fn:f}=__STORYBOOK_MODULE_TEST__,{userEvent:e,waitFor:w}=__STORYBOOK_MODULE_TEST__,$={title:"Components / Grids",component:v,args:{quickFilter:!0,quickFilterValue:"",quickFilterPlaceholder:"Quick filter...",selectable:!1,rowSelection:"single"},parameters:{docs:{source:{type:"code"}}},decorators:[r=>o.jsx("div",{style:{width:1024,height:400},children:o.jsx(S,{children:o.jsx(k,{children:o.jsx(r,{})})})})]},x=f(async()=>{console.log("multiEditAction"),await n(500)}),g=f(()=>(console.log("eAction"),!0)),l=f(()=>{console.log("bulkEditingCallback")}),_=r=>{const[u,s]=h.useState([]),d=h.useMemo(()=>[p({field:"id",headerName:"Id"}),p({field:"position",headerName:"Position",cellRendererParams:{warning:({value:t})=>t==="Tester"&&"Testers are testing",info:({value:t})=>t==="Developer"&&"Developers are awesome"}}),p({field:"age",headerName:"Age"}),G({field:"desc",headerName:"Description"},{}),I({colId:"popout_message",headerName:"Popout message",maxWidth:150,cellRenderer:()=>o.jsx(o.Fragment,{children:"Single Click me!"})},{multiEdit:!0,editorParams:{message:async t=>(await n(1e3),`There are ${t.length} row(s) selected`)}}),p({colId:"custom_edit",headerName:"Custom edit",maxWidth:100,editable:!0,valueFormatter:()=>"Press E",cellRendererParams:{rightHoverElement:o.jsx(C,{icon:"ic_launch_modal",title:"Title text",className:"GridCell-editableIcon"}),editAction:()=>{},shortcutKeys:{e:g}}}),y({},{multiEdit:!0,editorParams:{defaultAction:({menuOption:t})=>{console.log("clicked",{menuOption:t})},options:async t=>(await n(50),[{label:"Single edit only",action:async()=>{},disabled:t.length>1},{label:"Multi-edit",action:x},{label:"Disabled item",disabled:"Disabled for test"},{label:"Developer Only",hidden:t.some(c=>c.position!="Developer")},{label:"Other (TextInput)",action:async()=>{},subComponent:()=>o.jsx(T,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})},{label:"Other (TextArea)",action:async({menuOption:c})=>{console.log(`Sub selected value was ${JSON.stringify(c.subValue)}`),await n(500)},subComponent:()=>o.jsx(E,{placeholder:"Other",maxLength:5,required:!0,defaultValue:""})}])}}),y({editable:()=>!1},{editorParams:{options:()=>[]}})],[]),[i]=h.useState([{id:1e3,position:"Tester",age:30,desc:"Tests application",dd:"1"},{id:1001,position:"Developer",age:12,desc:"Develops application",dd:"2"},{id:1002,position:"Manager",age:65,desc:"Manages",dd:"3"}]);return o.jsx(v,{...r,selectable:!0,externalSelectedItems:u,setExternalSelectedItems:s,columnDefs:d,rowData:i,domLayout:"autoHeight",autoSelectFirstRow:!0,onBulkEditingComplete:l})},m=_.bind({});m.play=async({canvasElement:r})=>{const u=O(document.body);x.mockClear(),g.mockClear(),l.mockClear(),await D({canvasElement:r}),await w(()=>{const i=r.ownerDocument.activeElement;a(i).toHaveClass("ag-cell-focus"),a(i).toHaveAttribute("aria-colindex","1"),a(i?.parentElement).toHaveAttribute("row-index","0")}),console.log("arrow down to 3rd row"),await e.keyboard("{arrowdown}{arrowdown}"),console.log("arrow right to first popup menu"),await e.keyboard("{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}");const s=async(i,t,c)=>{await e.keyboard("{Enter}"),await n(1e3),await e.keyboard("{arrowdown}{arrowdown}"),i(),await w(()=>{const b=r.ownerDocument.activeElement;a(b).toHaveClass("ag-cell-focus"),a(b).toHaveAttribute("aria-colindex",t),a(b?.parentElement).toHaveAttribute("row-index",c)}),await n(200)};console.log("At 2nd to last cell open the popup menu and select 2nd option"),await s(()=>e.keyboard("{Enter}"),"8","2"),a(x).toHaveBeenCalled(),console.log("Open 2nd to last popup menu, tab to next disabled popup should fail"),await s(()=>e.tab(),"8","2"),a(l).toHaveBeenCalled(),l.mockClear(),console.log("Open 2nd to last popup menu, tab to desc cell"),await s(()=>e.tab({shift:!0}),"5","2"),console.log("Cancel edit"),await n(500),await e.keyboard("{Esc}"),a(l).toHaveBeenCalled(),l.mockClear(),await n(500),console.log("Open desc cell"),await e.keyboard("{Enter}");const d=await u.findByRole("textbox");a(d).toBeInTheDocument(),await e.clear(d),await e.type(d,"foo"),await e.tab(),await e.keyboard("{arrowleft}{arrowleft}{arrowleft}"),await e.keyboard("{Enter}"),await w(async()=>{await u.findByText(/There are 1 row/)},{timeout:5e3}),await e.keyboard("{Esc}"),await e.tab(),a(g).not.toHaveBeenCalled(),await e.keyboard("{Enter}"),await e.keyboard("e"),await w(()=>{a(g).toHaveBeenCalled()})};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
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
  }), GridPopoverTextArea({
    field: 'desc',
    headerName: 'Description'
  }, {}), GridPopoverMessage({
    colId: 'popout_message',
    headerName: 'Popout message',
    maxWidth: 150,
    cellRenderer: () => <>Single Click me!</>
  }, {
    multiEdit: true,
    editorParams: {
      message: async (selectedRows): Promise<string> => {
        await wait(1000);
        return \`There are \${selectedRows.length} row(s) selected\`;
      }
    }
  }), GridCell({
    colId: 'custom_edit',
    headerName: 'Custom edit',
    maxWidth: 100,
    editable: true,
    valueFormatter: () => 'Press E',
    cellRendererParams: {
      rightHoverElement: <GridIcon icon={'ic_launch_modal'} title={'Title text'} className={'GridCell-editableIcon'} />,
      editAction: () => {
        //
      },
      shortcutKeys: {
        e: eAction
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
        await wait(50);
        return [{
          label: 'Single edit only',
          action: async () => {
            //
          },
          disabled: selectedItems.length > 1
        }, {
          label: 'Multi-edit',
          action: multiEditAction
        }, {
          label: 'Disabled item',
          disabled: 'Disabled for test'
        }, {
          label: 'Developer Only',
          hidden: selectedItems.some(x => x.position != 'Developer')
        }, {
          label: 'Other (TextInput)',
          action: async () => {
            //
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
        }] as MenuOption<ITestRow>[];
      }
    }
  }), GridPopoverMenu({
    editable: () => false
  }, {
    editorParams: {
      options: () => []
    }
  })], []);
  const [rowData] = useState([{
    id: 1000,
    position: 'Tester',
    age: 30,
    desc: 'Tests application',
    dd: '1'
  }, {
    id: 1001,
    position: 'Developer',
    age: 12,
    desc: 'Develops application',
    dd: '2'
  }, {
    id: 1002,
    position: 'Manager',
    age: 65,
    desc: 'Manages',
    dd: '3'
  }]);
  return <Grid {...props} selectable={true} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} autoSelectFirstRow={true} onBulkEditingComplete={bulkEditingCallback} />;
}`,...m.parameters?.docs?.source}}};const J=["KeyboardInteractions"];export{m as KeyboardInteractions,J as __namedExportsOrder,$ as default};

import{j as o}from"./index-_eCCCJMN.js";/* empty css                  */import{G as h,a as w}from"./GridUpdatingContextProvider-DK2uKtWm.js";import"./stateDeferredHook-9sbfsEJK.js";import{r}from"./index-ne9I_3bB.js";import{G as u}from"./Grid-BnijaEma.js";import{M as v,G as O,e as S,a as P,b as x,c as D,i as G,j as E,k as F,l as T,f as C,g as I}from"./GridWrapper-DVhisWkQ.js";import{w as a}from"./util-DX3mDqFH.js";import{G as n}from"./GridPopoverEditDropDown-CHtgE0-u.js";import"./ActionButton-CwNE6oAT.js";import{w as j}from"./storybookTestUtil-B6V3sqEj.js";import"./index-JPfhvaY4.js";import"./index-DJy14G1K.js";const Q={title:"Components / Grids",component:u,args:{quickFilterValue:"",selectable:!0},decorators:[i=>o.jsx("div",{style:{width:1024,height:400},children:o.jsx(h,{children:o.jsx(w,{children:o.jsx(i,{})})})})]},g=i=>{const[p,m]=r.useState([]),d=r.useCallback(async(e,t)=>(console.log("optionsFn selected rows",e,t),t=t?.toLowerCase(),await a(1e3),[null,"Architect","Developer","Product Owner","Scrum Master","Tester",v,"Custom"].filter(c=>t!=null?c!=null&&c.toLowerCase().indexOf(t)===0:!0)),[]),s=r.useMemo(()=>[{code:"O1",desc:"Object One"},{code:"O2",desc:"Object Two"}],[]),b=r.useMemo(()=>[O({field:"id",headerName:"Id"}),n({field:"position2",headerName:"Multi-edit"},{multiEdit:!0,editorParams:{options:[F("Header"),{value:"1",label:"One",disabled:"Disabled for test"},{value:"2",label:"Two"},T,{value:"3",label:"Three"}]}}),n({field:"position3",headerName:"Custom callback"},{multiEdit:!0,editorParams:{options:[null,"Architect","Developer","Product Owner","Scrum Master","Tester"],onSelectedItem:async e=>{await a(2e3),e.selectedRows.forEach(t=>{t.position3=e.value})}}}),n({field:"position",headerName:"Options Fn"},{multiEdit:!1,editorParams:{filtered:"reload",filterPlaceholder:"Search me...",options:d}}),n({colId:"position3filtered",field:"position3",headerName:"Filtered",editable:!1},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",options:[null,"Architect","Developer","Product Owner","Scrum Master","Tester"]}}),n({colId:"position4",headerName:"Filtered (object)",valueGetter:({data:e})=>e?.position4?.desc},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",options:s.map(e=>({value:e,label:e.desc,disabled:!1}))}}),n({field:"code",headerName:"Filter Selectable"},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",filterHelpText:"Press enter to save custom value",options:s.map(e=>({value:e,label:e.desc,disabled:!1})),onSelectedItem:e=>{console.log("onSelectedItem selected",e),e.selectedRows.forEach(t=>t.code=e.value.code)},onSelectFilter:e=>{console.log("onSelectFilter selected",e),e.selectedRows.forEach(t=>t.code=e.value)}}}),n({field:"sub",headerName:"Subcomponent",valueGetter:({data:e})=>e?.sub},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",options:()=>[{value:"one",label:"One"},{value:"two",label:"Two"},{value:"oth",label:"Other text input",subComponent:()=>o.jsx(C,{placeholder:"Other...",defaultValue:"a",required:!0})},{value:"oth",label:"Other text area",subComponent:()=>o.jsx(I,{placeholder:"Other...",defaultValue:"b",required:!0})}],onSelectedItem:async e=>{console.log("onSelectedItem",e),await a(500),e.selectedRows.forEach(t=>t.sub=e.subComponentValue??e.value)}}}),S({},{editorParams:{options:()=>[{label:"Hello",action:async()=>{}}]}})],[d,s]),[f]=r.useState([{id:1e3,position:"Tester",position2:"1",position3:"Tester",position4:{code:"O1",desc:"Object One"},code:"O1",sub:"two"},{id:1001,position:"Developer",position2:"2",position3:"Developer",position4:{code:"O2",desc:"Object Two"},code:"O2",sub:"one"},{id:1002,position:"Scrum Master",position2:"2",position3:"Architect",position4:{code:"O2",desc:"Object Two"},code:"O2",sub:"one"}]);return o.jsxs(P,{maxHeight:300,children:[o.jsxs(x,{children:[o.jsx(D,{}),o.jsx(G,{}),o.jsx(E,{fileName:"customFilename"})]}),o.jsx(u,{...i,externalSelectedItems:p,setExternalSelectedItems:m,columnDefs:b,rowData:f,domLayout:"autoHeight",onCellEditingComplete:()=>{console.log("Cell editing complete")}})]})},l=g.bind({});l.play=j;l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const optionsFn = useCallback(async (selectedRows: ITestRow[], filter?: string) => {
    // eslint-disable-next-line no-console
    console.log('optionsFn selected rows', selectedRows, filter);
    filter = filter?.toLowerCase();
    await wait(1000);
    return [null, 'Architect', 'Developer', 'Product Owner', 'Scrum Master', 'Tester', MenuSeparatorString, 'Custom'].filter(v => filter != null ? v != null && v.toLowerCase().indexOf(filter) === 0 : true);
  }, []);
  const optionsObjects = useMemo(() => [{
    code: 'O1',
    desc: 'Object One'
  }, {
    code: 'O2',
    desc: 'Object Two'
  }], []);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => [GridCell({
    field: 'id',
    headerName: 'Id'
  }), GridPopoverEditDropDown<ITestRow, ITestRow['position2']>({
    field: 'position2',
    headerName: 'Multi-edit'
  }, {
    multiEdit: true,
    editorParams: {
      options: [MenuHeaderItem('Header'), {
        value: '1',
        label: 'One',
        disabled: 'Disabled for test'
      }, {
        value: '2',
        label: 'Two'
      }, MenuSeparator, {
        value: '3',
        label: 'Three'
      }]
    }
  }), GridPopoverEditDropDown({
    field: 'position3',
    headerName: 'Custom callback'
  }, {
    multiEdit: true,
    editorParams: {
      options: [null, 'Architect', 'Developer', 'Product Owner', 'Scrum Master', 'Tester'],
      onSelectedItem: async selected => {
        await wait(2000);
        selected.selectedRows.forEach(row => {
          row.position3 = selected.value;
        });
      }
    }
  }), GridPopoverEditDropDown({
    field: 'position',
    headerName: 'Options Fn'
  }, {
    multiEdit: false,
    editorParams: {
      filtered: 'reload',
      filterPlaceholder: 'Search me...',
      options: optionsFn
    }
  }), GridPopoverEditDropDown({
    colId: 'position3filtered',
    field: 'position3',
    headerName: 'Filtered',
    editable: false
  }, {
    multiEdit: true,
    editorParams: {
      filtered: 'local',
      filterPlaceholder: 'Filter this',
      options: [null, 'Architect', 'Developer', 'Product Owner', 'Scrum Master', 'Tester']
    }
  }), GridPopoverEditDropDown({
    colId: 'position4',
    headerName: 'Filtered (object)',
    valueGetter: ({
      data
    }) => data?.position4?.desc
  }, {
    multiEdit: true,
    editorParams: {
      filtered: 'local',
      filterPlaceholder: 'Filter this',
      options: optionsObjects.map(o => {
        return {
          value: o,
          label: o.desc,
          disabled: false
        };
      })
    }
  }), GridPopoverEditDropDown({
    field: 'code',
    headerName: 'Filter Selectable'
  }, {
    multiEdit: true,
    editorParams: {
      filtered: 'local',
      filterPlaceholder: 'Filter this',
      filterHelpText: 'Press enter to save custom value',
      options: optionsObjects.map(o => {
        return {
          value: o,
          label: o.desc,
          disabled: false
        };
      }),
      onSelectedItem: selected => {
        // eslint-disable-next-line no-console
        console.log('onSelectedItem selected', selected);
        selected.selectedRows.forEach(row => row.code = selected.value.code);
      },
      onSelectFilter: selected => {
        // eslint-disable-next-line no-console
        console.log('onSelectFilter selected', selected);
        selected.selectedRows.forEach(row => row.code = selected.value);
      }
    }
  }), GridPopoverEditDropDown({
    field: 'sub',
    headerName: 'Subcomponent',
    valueGetter: ({
      data
    }) => data?.sub
  }, {
    multiEdit: true,
    editorParams: {
      filtered: 'local',
      filterPlaceholder: 'Filter this',
      options: () => {
        return [{
          value: 'one',
          label: 'One'
        }, {
          value: 'two',
          label: 'Two'
        }, {
          value: 'oth',
          label: 'Other text input',
          subComponent: () => <GridFormSubComponentTextInput placeholder={'Other...'} defaultValue={'a'} required={true} />
        }, {
          value: 'oth',
          label: 'Other text area',
          subComponent: () => <GridFormSubComponentTextArea placeholder={'Other...'} defaultValue={'b'} required={true} />
        }];
      },
      onSelectedItem: async selected => {
        // eslint-disable-next-line no-console
        console.log('onSelectedItem', selected);
        await wait(500);
        selected.selectedRows.forEach(row => row.sub = selected.subComponentValue ?? selected.value);
      }
    }
  }), GridPopoverMenu({}, {
    editorParams: {
      options: () => [{
        label: 'Hello',
        action: async () => {}
      }]
    }
  })], [optionsFn, optionsObjects]);
  const [rowData] = useState([{
    id: 1000,
    position: 'Tester',
    position2: '1',
    position3: 'Tester',
    position4: {
      code: 'O1',
      desc: 'Object One'
    },
    code: 'O1',
    sub: 'two'
  }, {
    id: 1001,
    position: 'Developer',
    position2: '2',
    position3: 'Developer',
    position4: {
      code: 'O2',
      desc: 'Object Two'
    },
    code: 'O2',
    sub: 'one'
  }, {
    id: 1002,
    position: 'Scrum Master',
    position2: '2',
    position3: 'Architect',
    position4: {
      code: 'O2',
      desc: 'Object Two'
    },
    code: 'O2',
    sub: 'one'
  }] as ITestRow[]);
  return <GridWrapper maxHeight={300}>
      <GridFilters>
        <GridFilterQuick />
        <GridFilterColumnsToggle />
        <GridFilterDownloadCsvButton fileName={'customFilename'} />
      </GridFilters>
      <Grid {...props} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} onCellEditingComplete={() => {
      /* eslint-disable-next-line no-console */
      console.log('Cell editing complete');
    }} />
    </GridWrapper>;
}`,...l.parameters?.docs?.source}}};const U=["EditDropdown"];export{l as EditDropdown,U as __namedExportsOrder,Q as default};

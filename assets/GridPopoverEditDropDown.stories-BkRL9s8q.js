import{j as o}from"./index-uvRZkhe0.js";/* empty css                  */import{G as h,a as v}from"./GridUpdatingContextProvider-Bkhryk7M.js";import"./stateDeferredHook-Dh_hbzWK.js";import{r as l}from"./index-DQDNmYQF.js";import{M as O,p as a,G as S,e as P,a as T,b as x,c as D,i as E,j as G,k as F,l as C,f as I,g}from"./GridWrapper-DEY5Go7k.js";import{G as p}from"./Grid-C5eAYTiR.js";import{w as d}from"./util-CYV73bPB.js";import{G as n}from"./GridPopoverEditDropDown-Cdw4k0LW.js";import"./ActionButton-BDYCoy1d.js";import{w as j}from"./storybookTestUtil-DBFt3sMW.js";import"./index-DYVtDik4.js";import"./index-BFcdsecu.js";const U={title:"Components / Grids",component:p,args:{quickFilterValue:"",selectable:!0},decorators:[i=>o.jsx("div",{style:{width:1024,height:400},children:o.jsx(h,{children:o.jsx(v,{children:o.jsx(i,{})})})})]},M=i=>{const[m,b]=l.useState([]),c=l.useCallback(async(e,t)=>(console.log("optionsFn selected rows",e,t),t=t?.toLowerCase(),await d(1e3),[null,"Architect","Developer","Product Owner","Scrum Master","Tester",O,"Custom"].filter(u=>t!=null?u!=null&&u.toLowerCase().indexOf(t)===0:!0).map(a)),[]),s=l.useMemo(()=>[{code:"O1",desc:"Object One"},{code:"O2",desc:"Object Two"}],[]),w=l.useMemo(()=>[S({field:"id",headerName:"Id"}),n({field:"position2",headerName:"Multi-edit",singleClickEdit:!0},{multiEdit:!0,editorParams:{options:[F("Header"),{value:"1",label:"One",disabled:"Disabled for test"},{value:"2",label:"Two"},C,{value:"3",label:"Three"}]}}),n({field:"position3",headerName:"Custom callback"},{multiEdit:!0,editorParams:{options:[null,"Architect","Developer","Product Owner","Scrum Master","Tester"].map(a),onSelectedItem:async e=>{await d(2e3),e.selectedRows.forEach(t=>{t.position3=e.value})}}}),n({field:"position",headerName:"Options Fn"},{multiEdit:!1,editorParams:{filtered:"reload",filterPlaceholder:"Search me...",options:c}}),n({colId:"position3filtered",field:"position3",headerName:"Filtered",editable:!1},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",options:[null,"Architect","Developer","Product Owner","Scrum Master","Tester"].map(a)}}),n({field:"position4",headerName:"Filtered (object)",valueGetter:({data:e})=>e?.position4?.desc},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",options:s.map(e=>({value:e,label:e.desc,disabled:!1}))}}),n({field:"code",headerName:"Filter Selectable"},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",filterHelpText:"Press enter to save custom value",options:s.map(e=>({value:e.code,label:e.desc,disabled:!1})),onSelectedItem:e=>{console.log("onSelectedItem selected",e),e.selectedRows.forEach(t=>{t.code=e.value})},onSelectFilter:e=>{console.log("onSelectFilter selected",e),e.selectedRows.forEach(t=>{t.code=e.value})}}}),n({field:"sub",headerName:"Subcomponent",valueGetter:({data:e})=>e?.sub},{multiEdit:!0,editorParams:{filtered:"local",filterPlaceholder:"Filter this",options:()=>[{value:"one",label:"One"},{value:"two",label:"Two"},{value:"oth",label:"Other text input",subComponent:()=>o.jsx(I,{placeholder:"Other...",defaultValue:"a",required:!0})},{value:"oth",label:"Other text area",subComponent:()=>o.jsx(g,{placeholder:"Other...",defaultValue:"b",required:!0})}],onSelectedItem:async e=>{console.log("onSelectedItem",e),await d(500),e.selectedRows.forEach(t=>t.sub=e.subComponentValue??e.value)}}}),P({},{editorParams:{options:()=>[{label:"Hello",action:async()=>{}}]}})],[c,s]),[f]=l.useState([{id:1e3,position:"Tester",position2:"1",position3:"Tester",position4:{code:"O1",desc:"Object One"},code:"O1",sub:"two"},{id:1001,position:"Developer",position2:"2",position3:"Developer",position4:{code:"O2",desc:"Object Two"},code:"O2",sub:"one"},{id:1002,position:"Scrum Master",position2:"2",position3:"Architect",position4:{code:"O2",desc:"Object Two"},code:"O2",sub:"one"}]);return o.jsxs(T,{maxHeight:300,children:[o.jsxs(x,{children:[o.jsx(D,{}),o.jsx(E,{}),o.jsx(G,{fileName:"customFilename"})]}),o.jsx(p,{...i,externalSelectedItems:m,setExternalSelectedItems:b,columnDefs:w,rowData:f,domLayout:"autoHeight",onCellEditingComplete:()=>{console.log("Cell editing complete")}})]})},r=M.bind({});r.play=j;r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(props: GridProps) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const optionsFn = useCallback(async (selectedRows: ITestRow[], filter?: string) => {
    // eslint-disable-next-line no-console
    console.log('optionsFn selected rows', selectedRows, filter);
    filter = filter?.toLowerCase();
    await wait(1000);
    return [null, 'Architect', 'Developer', 'Product Owner', 'Scrum Master', 'Tester', MenuSeparatorString, 'Custom'].filter(v => filter != null ? v != null && v.toLowerCase().indexOf(filter) === 0 : true).map(primitiveToSelectOption);
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
    headerName: 'Multi-edit',
    singleClickEdit: true
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
  }), GridPopoverEditDropDown<ITestRow, ITestRow['position3'], string | null>({
    field: 'position3',
    headerName: 'Custom callback'
  }, {
    multiEdit: true,
    editorParams: {
      options: [null, 'Architect', 'Developer', 'Product Owner', 'Scrum Master', 'Tester'].map(primitiveToSelectOption),
      onSelectedItem: async selected => {
        await wait(2000);
        selected.selectedRows.forEach(row => {
          row.position3 = selected.value;
        });
      }
    }
  }), GridPopoverEditDropDown<ITestRow, ITestRow['position3'], string | null>({
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
      options: [null, 'Architect', 'Developer', 'Product Owner', 'Scrum Master', 'Tester'].map(primitiveToSelectOption)
    }
  }), GridPopoverEditDropDown({
    field: 'position4',
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
  }), GridPopoverEditDropDown<ITestRow, ITestRow['code'], string | null>({
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
          value: o.code,
          label: o.desc,
          disabled: false
        };
      }),
      onSelectedItem: selected => {
        // eslint-disable-next-line no-console
        console.log('onSelectedItem selected', selected);
        selected.selectedRows.forEach(row => {
          row.code = selected.value;
        });
      },
      onSelectFilter: selected => {
        // eslint-disable-next-line no-console
        console.log('onSelectFilter selected', selected);
        selected.selectedRows.forEach(row => {
          row.code = selected.value;
        });
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
}`,...r.parameters?.docs?.source}}};const z=["EditDropdown"];export{r as EditDropdown,z as __namedExportsOrder,U as default};

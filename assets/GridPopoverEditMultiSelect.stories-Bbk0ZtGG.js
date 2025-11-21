import{c as x,j as r,w as c,n as m}from"./util-B1lB3GhT.js";/* empty css                  *//* empty css              */import"./stateDeferredHook-Cj269tWz.js";import{r as d}from"./iframe-smKoh4tb.js";import{G as b,u as E,v as f,o as R,g as P}from"./GridWrapper-DtoEoUNi.js";import{G as w}from"./Grid-Q3rFMtHJ.js";import"./client-Kh56r61r.js";import{G,a as V}from"./GridUpdatingContextProvider-qT4OMujP.js";import"./ActionButton-Bm-II8tU.js";import{w as M}from"./storybookTestUtil-CmriYLwu.js";import"./index-WFabMzKZ.js";import"./preload-helper-PPVm8Dsz.js";const v=(i,s)=>b(i,{editor:E,...s,editorParams:{...s.editorParams,className:x("GridMultiSelect-containerMedium",s.editorParams?.className)}}),q={title:"Components / Grids",component:w,args:{quickFilterValue:"",selectable:!0},decorators:[i=>r.jsx("div",{style:{width:1024,height:400},children:r.jsx(G,{children:r.jsx(V,{children:r.jsx(i,{})})})})]},A=i=>{const[s,h]=d.useState([]),L=d.useMemo(()=>{const u={lot1:"Lot 1",lot2:"Lot 2",lot3:"Lot 3",lot4:"Lot A 482392",appA:"A",appB:"B",other:"Other"};return[b({field:"id",headerName:"Id"}),v({field:"position",headerName:"Position",valueFormatter:({value:e})=>e==null?"":e.map(t=>u[t]??t).join(", ")},{multiEdit:!0,editorParams:{filtered:!0,filterPlaceholder:"Filter position",className:"GridMultiSelect-containerUnlimited",headers:[{header:"Header item"}],options:e=>{const t=e[0];return[{value:"lot1",label:"Lot 1"},{value:"lot2",label:"Lot 2"},{value:"lot3",label:"Lot 3"},{value:"lot11",label:"Lot 11"},{value:"lot4",label:"Lot A 482392"},{value:"appA",label:"A"},{value:"appB",label:"B"},R,{value:"other",label:"Other",subComponent:()=>r.jsx(P,{required:!0,maxLength:5,defaultValue:""})}].map(o=>({...o,checked:t.position?.includes(o.value)}))},onSave:async({selectedRows:e,selectedOptions:t})=>{console.log("multiSelect result",{selectedRows:e,selectedOptions:t}),await c(1e3);const[o,a]=f(t,l=>l.subComponent),p=[...a.map(l=>l.value),...o.map(l=>l.subValue)];return e.forEach(l=>l.position=p),!0}}}),v({colId:"position2",field:"position",headerName:"Parcel picker",valueFormatter:({value:e})=>e==null?"":e.map(t=>u[t]??t).join(", ")},{multiEdit:!0,editorParams:{filtered:!0,filterPlaceholder:"Filter/add custom parcel...",filterHelpText:(e,t)=>m(e)||t.find(o=>o.label&&o.label.toLowerCase()===e.toLowerCase())?void 0:"Press enter to add free text",onSelectFilter:({filter:e,options:t})=>{m(e)||t.find(o=>o.label&&o.label.toLowerCase()===e.toLowerCase())||t.push({value:e,label:e,filter:"freeText",checked:!0})},className:"GridMultiSelect-containerLarge",headers:[{header:"Free text",filter:"freeText"},{header:"Parcels"}],options:e=>{const t=e[0],o=[{value:"lot1",label:"Lot 1"},{value:"lot2",label:"Lot 2",warning:"Don't select me"},{value:"lot3",label:"Lot 3"},{value:"lot11",label:"Lot 11"},{value:"lot4",label:"Lot A 482392"},{value:"appA",label:"A"},{value:"appB",label:"B"}].map(a=>({...a,checked:t.position?.includes(a.value)}));return t.position?.forEach(a=>!(a in u)&&o.push({value:a,label:a,checked:!0,filter:"freeText"})),o},onSave:async({selectedRows:e,selectedOptions:t})=>{console.log("multiSelect result",{selectedRows:e,selectedOptions:t}),await c(1e3);const[o,a]=f(t,l=>l.subComponent),p=[...a.map(l=>l.value),...o.map(l=>l.subValue)];return e.forEach(l=>l.position=p),!0}}})]},[]),[S]=d.useState([{id:1e3,position:["lot1","lot2"],position2:"lot1",position3:"Tester"},{id:1001,position:["appA"],position2:"lot2",position3:"Developer"}]);return r.jsx(w,{...i,animateRows:!0,externalSelectedItems:s,setExternalSelectedItems:h,columnDefs:L,rowData:S,domLayout:"autoHeight"})},n=A.bind({});n.play=M;n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`(props: GridProps<ITestRow>) => {
  const [externalSelectedItems, setExternalSelectedItems] = useState<any[]>([]);
  const columnDefs: ColDefT<ITestRow>[] = useMemo(() => {
    const positionMap: Record<string, string> = {
      lot1: 'Lot 1',
      lot2: 'Lot 2',
      lot3: 'Lot 3',
      lot4: 'Lot A 482392',
      appA: 'A',
      appB: 'B',
      other: 'Other'
    };
    return [GridCell({
      field: 'id',
      headerName: 'Id'
    }), GridPopoutEditMultiSelect<ITestRow, ITestRow['position']>({
      field: 'position',
      headerName: 'Position',
      valueFormatter: ({
        value
      }) => {
        if (value == null) return '';
        return value.map((v: string) => positionMap[v] ?? v).join(', ');
      }
    }, {
      multiEdit: true,
      editorParams: {
        filtered: true,
        filterPlaceholder: 'Filter position',
        className: 'GridMultiSelect-containerUnlimited',
        headers: [{
          header: 'Header item'
        }],
        options: selectedRows => {
          const firstRow = selectedRows[0];
          return [{
            value: 'lot1',
            label: 'Lot 1'
          }, {
            value: 'lot2',
            label: 'Lot 2'
          }, {
            value: 'lot3',
            label: 'Lot 3'
          }, {
            value: 'lot11',
            label: 'Lot 11'
          }, {
            value: 'lot4',
            label: 'Lot A 482392'
          }, {
            value: 'appA',
            label: 'A'
          }, {
            value: 'appB',
            label: 'B'
          }, MenuSeparator, {
            value: 'other',
            label: 'Other',
            subComponent: () => <GridFormSubComponentTextArea required={true} maxLength={5} defaultValue={''} />
          }].map(r => ({
            ...r,
            checked: firstRow.position?.includes(r.value)
          }));
        },
        onSave: async ({
          selectedRows,
          selectedOptions
        }) => {
          // eslint-disable-next-line no-console
          console.log('multiSelect result', {
            selectedRows,
            selectedOptions
          });
          await wait(1000);
          const [subValues, normalValues] = partition(selectedOptions, o => o.subComponent);
          const newValue = [...normalValues.map(o => o.value), ...subValues.map(o => o.subValue)];
          selectedRows.forEach(row => row.position = newValue);
          return true;
        }
      }
    }), GridPopoutEditMultiSelect<ITestRow, ITestRow['position']>({
      colId: 'position2',
      field: 'position',
      headerName: 'Parcel picker',
      valueFormatter: ({
        value
      }) => {
        if (value == null) return '';
        return value.map((v: string) => positionMap[v] ?? v).join(', ');
      }
    }, {
      multiEdit: true,
      editorParams: {
        filtered: true,
        filterPlaceholder: 'Filter/add custom parcel...',
        filterHelpText: (filter, options) => isEmpty(filter) || options.find(o => o.label && o.label.toLowerCase() === filter.toLowerCase()) ? undefined : 'Press enter to add free text',
        onSelectFilter: ({
          filter,
          options
        }) => {
          if (isEmpty(filter) || options.find(o => o.label && o.label.toLowerCase() === filter.toLowerCase())) return;
          options.push({
            value: filter,
            label: filter,
            filter: 'freeText',
            checked: true
          });
        },
        className: 'GridMultiSelect-containerLarge',
        headers: [{
          header: 'Free text',
          filter: 'freeText'
        }, {
          header: 'Parcels'
        }],
        options: selectedRows => {
          const firstRow = selectedRows[0];
          const r: MultiSelectOption[] = [{
            value: 'lot1',
            label: 'Lot 1'
          }, {
            value: 'lot2',
            label: 'Lot 2',
            warning: "Don't select me"
          }, {
            value: 'lot3',
            label: 'Lot 3'
          }, {
            value: 'lot11',
            label: 'Lot 11'
          }, {
            value: 'lot4',
            label: 'Lot A 482392'
          }, {
            value: 'appA',
            label: 'A'
          }, {
            value: 'appB',
            label: 'B'
          }].map(r => ({
            ...r,
            checked: firstRow.position?.includes(r.value)
          }));
          firstRow.position?.forEach(p => !(p in positionMap) && r.push({
            value: p,
            label: p,
            checked: true,
            filter: 'freeText'
          }));
          return r;
        },
        onSave: async ({
          selectedRows,
          selectedOptions
        }) => {
          // eslint-disable-next-line no-console
          console.log('multiSelect result', {
            selectedRows,
            selectedOptions
          });
          await wait(1000);
          const [subValues, normalValues] = partition(selectedOptions, o => o.subComponent);
          const newValue = [...normalValues.map(o => o.value), ...subValues.map(o => o.subValue)];
          selectedRows.forEach(row => row.position = newValue);
          return true;
        }
      }
    })];
  }, []);
  const [rowData] = useState([{
    id: 1000,
    position: ['lot1', 'lot2'],
    position2: 'lot1',
    position3: 'Tester'
  }, {
    id: 1001,
    position: ['appA'],
    position2: 'lot2',
    position3: 'Developer'
  }] as ITestRow[]);
  return <Grid {...props} animateRows={true} externalSelectedItems={externalSelectedItems} setExternalSelectedItems={setExternalSelectedItems} columnDefs={columnDefs} rowData={rowData} domLayout={'autoHeight'} />;
}`,...n.parameters?.docs?.source}}};const U=["EditMultiSelect"];export{n as EditMultiSelect,U as __namedExportsOrder,q as default};

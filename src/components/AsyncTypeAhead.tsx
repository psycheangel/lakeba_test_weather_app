import React, { useCallback, useLayoutEffect, useState } from 'react';
import {useAppDispatch, useAppSelector} from "../helpers/hooks"
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { render } from 'react-dom';
import {getGeoCoding,getGeoCodingByZip, getReverseGeoCoding,getWeatherData} from "../store/actions";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Card from 'react-bootstrap/Card';



function AsyncSearchBar() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<string>>([]);
  const [query, setQuery] = useState<string>('');
  //const latlonList = useAppSelector((state)=>state.latlon);
  const namesList = useAppSelector((state)=>state.names);
  const dispatch = useAppDispatch()
  const handleInputChange = useCallback((q : string) => {
    
    // if(namesList && namesList.includes(q)){
    //   let index = namesList.findIndex((array)=> array == q);
    //   dispatch(SetSearchIndex(index));
    // }
  },[namesList]);

  const handleSelected = useCallback((q : Option[]) => {
      if(q && typeof q === "object" && Array.isArray(q) == true && q.length > 0){
        let selectedQuery = q[0];
        let index = namesList.findIndex((array)=> array == selectedQuery);
        dispatch(getWeatherData(index));
      } else if(q && typeof q == "string"){
        let index = namesList.findIndex((array)=> array == q);
        dispatch(getWeatherData(index));
      }
  },[namesList]);
  
  const handleSelectorEffect = useLayoutEffect(()=>{

    setOptions(namesList);
    setIsLoading(false);
  },[isLoading, namesList])

  // `handleInputChange` updates state and triggers a re-render, so
  // use `useCallback` to prevent the debounced search handler from
  // being cancelled.
  const handleSearch = useCallback((q : string) => {
    
    setIsLoading(true);
    if(q.match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g)){
      dispatch(getReverseGeoCoding(q));
    } else if(/^\d+$/.test(q) && isNaN(parseInt(q)) === false){
      dispatch(getGeoCodingByZip(q));
    }else {
      dispatch(getGeoCoding(q));
    }
  }, []);
  
  return (
    <AsyncTypeahead
      id="async-pagination-example"
      isLoading={isLoading}
      labelKey="Location to search"
      maxResults={5}
      minLength={2}
      filterBy={()=>true}
      onInputChange={handleInputChange}
      onChange={handleSelected}
      onSearch={handleSearch}
      options={options}
      paginate={false}
      placeholder="Search by Location/Zipcode/Coordinate"
      renderMenuItemChildren={(option,props,id) => {
        return (
          <div key={id}>
        {option.toString()}
      </div>
      );
      }}
      useCache={false}
    />
  );
}

export default AsyncSearchBar;

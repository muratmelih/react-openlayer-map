import React, { useEffect, useState } from "react";
interface propTypes {
  label: string;
  layerClassName: string;
  changeLayerVisiblity: (value:boolean,layerClassName:string)=>void;
}
function LayerChangeCheckbox(props: propTypes) {
  const [checked, setChecked] = useState(true);

  const onCheckboxChange = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    props.changeLayerVisiblity(checked, props.layerClassName);
  }, [checked]);

  return (
    <>
      <input
        type="checkbox"
        id="layers-checkbox"
        name="layers-checkbox"
        value="true"
        checked={checked}
        onChange={onCheckboxChange}
      />
      <label htmlFor="layers-checkbox">{props.label}</label>
    </>
  );
}

export default LayerChangeCheckbox;

import React, { useState, FunctionComponent, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Platform
} from "react-native";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { size, borderRadius, color, fontSize } from "../../common/styles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { DropdownFilterInput } from "../DropdownFilterModal/DropdownFilterInput";
import { nationalityItems } from "../DropdownFilterModal/nationalityItems";
import { DropdownItem } from "../DropdownFilterModal/DropdownFilterModal";
import ScanbotSDK from "react-native-scanbot-sdk";
import { MrzScannerConfiguration } from "react-native-scanbot-sdk/src";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  inputAndButtonWrapper: {
    marginTop: size(3),
    flexDirection: "row",
    alignItems: "flex-end"
  },
  inputWrapper: {
    flex: 1,
    marginRight: size(1)
  },
  inputView: {
    marginTop: size(1),
    minHeight: size(6),
    borderRadius: borderRadius(2),
    borderWidth: 1,
    backgroundColor: color("grey", 0),
    borderColor: color("blue", 50)
  },
  inputText: {
    minHeight: size(6),
    paddingHorizontal: size(1),
    fontSize: fontSize(0),
    color: color("blue", 50)
  },
  cameraWrapper: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color("grey", 0)
  }
});

interface ManualPassportInput {
  openCamera: () => void;
  closeCamera: () => void;
  mrzResult: string;
  setMrzResult: (id: string) => void;
  setIdInput: (id: string) => void;
  submitId: () => void;
}

export const ManualPassportInput: FunctionComponent<ManualPassportInput> = ({
  openCamera,
  mrzResult,
  setMrzResult,
  setIdInput,
  submitId
}) => {
  const [selectedCountry, setSelectedCountry] = useState<DropdownItem | null>(
    null
  );
  const [passportNo, setPassportNo] = useState<string | null>(null);

  const onItemSelection = (item: DropdownItem): void => {
    setSelectedCountry(item);
  };

  const onPassportNoChanged = (passportNo: string): void => {
    setPassportNo(passportNo);
  };

  useEffect(() => {
    selectedCountry && passportNo
      ? setIdInput(`${selectedCountry?.id}-${passportNo}`)
      : setIdInput("");
  }, [selectedCountry, passportNo, setIdInput]);

  const startMRZScanner = async () => {
    const config: MrzScannerConfiguration = {
      // Customize colors, text resources, etc..
      finderTextHint:
        "Please hold your phone over the 2- or 3-line MRZ code at the front of your passport."
    };

    if (Platform.OS === "ios") {
      const { width } = Dimensions.get("window");
      config.finderWidth = width * 0.9;
      config.finderHeight = width * 0.18;
    }

    const result = await ScanbotSDK.UI.startMrzScanner(config);
    if (result.status === "OK") {
      let natCode = "";
      let docNo = "";
      const fields = result.fields.map(f => {
        if (f.name === "IssuingStateOrOrganization") natCode = f.value;
        else if (f.name === "DocumentCode") docNo = f.value;
        return `${f.name}: ${f.value} (${f.confidence.toFixed(2)})`;
      });
      console.log(fields.join("\n"));
      setMrzResult(`${natCode}-${docNo}`);
    }
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <DropdownFilterInput
            label="Country of nationality"
            placeholder="Search country"
            value={selectedCountry?.name}
            dropdownItems={nationalityItems}
            onItemSelection={onItemSelection}
          />
        </View>
      </View>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <InputWithLabel
            label="Passport number"
            value={passportNo ? passportNo : undefined}
            onChange={({ nativeEvent: { text } }) => onPassportNoChanged(text)}
            onSubmitEditing={submitId}
            autoCompleteType="off"
            autoCorrect={false}
            keyboardType={"default"}
          />
        </View>
      </View>
      <View
        onTouchStart={() => {
          // openCamera();
          startMRZScanner();
        }}
        style={styles.inputView}
      >
        <TextInput
          style={styles.inputText}
          placeholder={"press to take MRZ image"}
          editable={false}
        >
          {mrzResult}
        </TextInput>
      </View>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <DarkButton fullWidth={true} text="Submit" onPress={submitId} />
        </View>
      </View>
    </View>
  );
};

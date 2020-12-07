import React, { useState, FunctionComponent } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { size, borderRadius, color, fontSize } from "../../common/styles";
import { lineHeight } from "../../common/styles/typography";
import { AppText } from "../Layout/AppText";
import { DropdownFilterModal, DropdownItem } from "./DropdownFilterModal";

const styles = StyleSheet.create({
  label: {
    fontFamily: "brand-bold",
  },
  inputView: {
    marginTop: size(1),
    minHeight: size(6),
    borderRadius: borderRadius(2),
    borderWidth: 1,
    backgroundColor: color("grey", 0),
    borderColor: color("grey", 40),
  },
  inputText: {
    minHeight: size(6),
    padding: size(1.5),
    fontFamily: "brand-regular",
    fontSize: fontSize(0),
    lineHeight: lineHeight(0, true),
    color: color("grey", 40),
  },
});

export interface DropdownFilterInput {
  label: string;
  placeholder: string;
  value?: string;
  dropdownItems: DropdownItem[];
  onItemSelection: (item: DropdownItem) => void;
}

export const DropdownFilterInput: FunctionComponent<DropdownFilterInput> = ({
  label,
  placeholder,
  value,
  dropdownItems,
  onItemSelection,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (): void => {
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
  };

  return (
    <View>
      <DropdownFilterModal
        isVisible={modalVisible}
        dropdownItems={dropdownItems}
        label={label}
        placeholder={placeholder}
        onItemSelection={onItemSelection}
        closeModal={closeModal}
      />
      <AppText style={styles.label}>{label}</AppText>
      {/* need a View because Android is not able to response to onTouchStart on a non-editable TextInput*/}
      <View
        onTouchStart={() => {
          openModal();
        }}
        style={styles.inputView}
      >
        <TextInput
          style={styles.inputText}
          placeholder={placeholder}
          editable={false}
        >
          {value}
        </TextInput>
      </View>
    </View>
  );
};

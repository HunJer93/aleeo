// Mock for @ark-ui/react to resolve dependency conflicts with Chakra UI v3
// This addresses the missing '@ark-ui/react/download-trigger' error in Jest tests

// Mock all Ark UI components that Chakra UI depends on
const mockComponent = (name) => {
  const MockedComponent = ({ children, ...props }) => (
    <div data-testid={`ark-${name.toLowerCase()}`} {...props}>
      {children}
    </div>
  );
  MockedComponent.displayName = `Mock${name}`;
  return MockedComponent;
};

// Common Ark UI components that Chakra UI v3 uses
export const Dialog = {
  Root: mockComponent('DialogRoot'),
  Trigger: mockComponent('DialogTrigger'),
  Content: mockComponent('DialogContent'),
  Title: mockComponent('DialogTitle'),
  Description: mockComponent('DialogDescription'),
  Backdrop: mockComponent('DialogBackdrop'),
  Positioner: mockComponent('DialogPositioner'),
  CloseTrigger: mockComponent('DialogCloseTrigger'),
};

export const Popover = {
  Root: mockComponent('PopoverRoot'),
  Trigger: mockComponent('PopoverTrigger'),
  Content: mockComponent('PopoverContent'),
  Title: mockComponent('PopoverTitle'),
  Description: mockComponent('PopoverDescription'),
  Arrow: mockComponent('PopoverArrow'),
  Positioner: mockComponent('PopoverPositioner'),
  CloseTrigger: mockComponent('PopoverCloseTrigger'),
};

export const Menu = {
  Root: mockComponent('MenuRoot'),
  Trigger: mockComponent('MenuTrigger'),
  Content: mockComponent('MenuContent'),
  Item: mockComponent('MenuItem'),
  ItemGroup: mockComponent('MenuItemGroup'),
  ItemGroupLabel: mockComponent('MenuItemGroupLabel'),
  Separator: mockComponent('MenuSeparator'),
  Positioner: mockComponent('MenuPositioner'),
  Arrow: mockComponent('MenuArrow'),
};

export const Tooltip = {
  Root: mockComponent('TooltipRoot'),
  Trigger: mockComponent('TooltipTrigger'),
  Content: mockComponent('TooltipContent'),
  Arrow: mockComponent('TooltipArrow'),
  Positioner: mockComponent('TooltipPositioner'),
};

export const Toast = {
  Root: mockComponent('ToastRoot'),
  Title: mockComponent('ToastTitle'),
  Description: mockComponent('ToastDescription'),
  ActionTrigger: mockComponent('ToastActionTrigger'),
  CloseTrigger: mockComponent('ToastCloseTrigger'),
};

export const Accordion = {
  Root: mockComponent('AccordionRoot'),
  Item: mockComponent('AccordionItem'),
  ItemTrigger: mockComponent('AccordionItemTrigger'),
  ItemContent: mockComponent('AccordionItemContent'),
  ItemIndicator: mockComponent('AccordionItemIndicator'),
};

export const Tabs = {
  Root: mockComponent('TabsRoot'),
  List: mockComponent('TabsList'),
  Trigger: mockComponent('TabsTrigger'),
  Content: mockComponent('TabsContent'),
  Indicator: mockComponent('TabsIndicator'),
};

export const Select = {
  Root: mockComponent('SelectRoot'),
  Trigger: mockComponent('SelectTrigger'),
  Content: mockComponent('SelectContent'),
  Item: mockComponent('SelectItem'),
  ItemText: mockComponent('SelectItemText'),
  ItemIndicator: mockComponent('SelectItemIndicator'),
  Positioner: mockComponent('SelectPositioner'),
  Label: mockComponent('SelectLabel'),
  ValueText: mockComponent('SelectValueText'),
};

export const Slider = {
  Root: mockComponent('SliderRoot'),
  Track: mockComponent('SliderTrack'),
  Range: mockComponent('SliderRange'),
  Thumb: mockComponent('SliderThumb'),
  Label: mockComponent('SliderLabel'),
  ValueText: mockComponent('SliderValueText'),
  MarkerGroup: mockComponent('SliderMarkerGroup'),
  Marker: mockComponent('SliderMarker'),
};

export const Switch = {
  Root: mockComponent('SwitchRoot'),
  Control: mockComponent('SwitchControl'),
  Thumb: mockComponent('SwitchThumb'),
  Label: mockComponent('SwitchLabel'),
};

export const Checkbox = {
  Root: mockComponent('CheckboxRoot'),
  Control: mockComponent('CheckboxControl'),
  Label: mockComponent('CheckboxLabel'),
  Indicator: mockComponent('CheckboxIndicator'),
};

export const RadioGroup = {
  Root: mockComponent('RadioGroupRoot'),
  Item: mockComponent('RadioGroupItem'),
  ItemControl: mockComponent('RadioGroupItemControl'),
  ItemText: mockComponent('RadioGroupItemText'),
  Label: mockComponent('RadioGroupLabel'),
  Indicator: mockComponent('RadioGroupIndicator'),
};

export const Progress = {
  Root: mockComponent('ProgressRoot'),
  Track: mockComponent('ProgressTrack'),
  Range: mockComponent('ProgressRange'),
  Label: mockComponent('ProgressLabel'),
  ValueText: mockComponent('ProgressValueText'),
  Circle: mockComponent('ProgressCircle'),
  CircleTrack: mockComponent('ProgressCircleTrack'),
  CircleRange: mockComponent('ProgressCircleRange'),
};

export const NumberInput = {
  Root: mockComponent('NumberInputRoot'),
  Input: mockComponent('NumberInputInput'),
  IncrementTrigger: mockComponent('NumberInputIncrementTrigger'),
  DecrementTrigger: mockComponent('NumberInputDecrementTrigger'),
  Label: mockComponent('NumberInputLabel'),
  ValueText: mockComponent('NumberInputValueText'),
};

export const PinInput = {
  Root: mockComponent('PinInputRoot'),
  Input: mockComponent('PinInputInput'),
  Label: mockComponent('PinInputLabel'),
};

export const SegmentGroup = {
  Root: mockComponent('SegmentGroupRoot'),
  Item: mockComponent('SegmentGroupItem'),
  ItemText: mockComponent('SegmentGroupItemText'),
  Indicator: mockComponent('SegmentGroupIndicator'),
  Label: mockComponent('SegmentGroupLabel'),
};

export const RatingGroup = {
  Root: mockComponent('RatingGroupRoot'),
  Item: mockComponent('RatingGroupItem'),
  Label: mockComponent('RatingGroupLabel'),
};

export const FileUpload = {
  Root: mockComponent('FileUploadRoot'),
  Dropzone: mockComponent('FileUploadDropzone'),
  Trigger: mockComponent('FileUploadTrigger'),
  Label: mockComponent('FileUploadLabel'),
  ItemGroup: mockComponent('FileUploadItemGroup'),
  Item: mockComponent('FileUploadItem'),
  ItemName: mockComponent('FileUploadItemName'),
  ItemSizeText: mockComponent('FileUploadItemSizeText'),
  ItemDeleteTrigger: mockComponent('FileUploadItemDeleteTrigger'),
};

export const ColorPicker = {
  Root: mockComponent('ColorPickerRoot'),
  Content: mockComponent('ColorPickerContent'),
  Trigger: mockComponent('ColorPickerTrigger'),
  Label: mockComponent('ColorPickerLabel'),
  ValueText: mockComponent('ColorPickerValueText'),
  Area: mockComponent('ColorPickerArea'),
  AreaThumb: mockComponent('ColorPickerAreaThumb'),
  ChannelSlider: mockComponent('ColorPickerChannelSlider'),
  ChannelSliderThumb: mockComponent('ColorPickerChannelSliderThumb'),
  SwatchGroup: mockComponent('ColorPickerSwatchGroup'),
  Swatch: mockComponent('ColorPickerSwatch'),
  EyeDropperTrigger: mockComponent('ColorPickerEyeDropperTrigger'),
};

export const DatePicker = {
  Root: mockComponent('DatePickerRoot'),
  Content: mockComponent('DatePickerContent'),
  Trigger: mockComponent('DatePickerTrigger'),
  Input: mockComponent('DatePickerInput'),
  Label: mockComponent('DatePickerLabel'),
  ValueText: mockComponent('DatePickerValueText'),
  View: mockComponent('DatePickerView'),
  ViewControl: mockComponent('DatePickerViewControl'),
  PrevTrigger: mockComponent('DatePickerPrevTrigger'),
  NextTrigger: mockComponent('DatePickerNextTrigger'),
  ViewTrigger: mockComponent('DatePickerViewTrigger'),
  RangeText: mockComponent('DatePickerRangeText'),
  Table: mockComponent('DatePickerTable'),
  TableHead: mockComponent('DatePickerTableHead'),
  TableHeader: mockComponent('DatePickerTableHeader'),
  TableBody: mockComponent('DatePickerTableBody'),
  TableRow: mockComponent('DatePickerTableRow'),
  TableCell: mockComponent('DatePickerTableCell'),
  TableCellTrigger: mockComponent('DatePickerTableCellTrigger'),
};

// Handle any missing exports by providing a default mock
const defaultMock = new Proxy({}, {
  get: (target, prop) => {
    if (typeof prop === 'string') {
      return mockComponent(prop);
    }
    return undefined;
  }
});

export default defaultMock;
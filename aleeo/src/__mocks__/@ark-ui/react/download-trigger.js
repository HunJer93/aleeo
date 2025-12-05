// Mock for @ark-ui/react/download-trigger to resolve Chakra UI v3 dependency conflict

const mockComponent = (name) => {
  const MockedComponent = ({ children, ...props }) => (
    <div data-testid={`ark-${name.toLowerCase()}`} {...props}>
      {children}
    </div>
  );
  MockedComponent.displayName = `Mock${name}`;
  return MockedComponent;
};

export const DownloadTrigger = {
  Root: mockComponent('DownloadTriggerRoot'),
  Trigger: mockComponent('DownloadTriggerTrigger'),
  Content: mockComponent('DownloadTriggerContent'),
};

export default DownloadTrigger;
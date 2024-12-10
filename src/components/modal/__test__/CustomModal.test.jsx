import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// import CustomModal, { FormHeader } from './CustomModal';
import CloseIcon from '@mui/icons-material/Close';
import CustomModal, { FormHeader } from '../CustomModal';

describe('CustomModal Component', () => {
  const handleCloseMock = jest.fn();

  const renderModal = (props = {}) => {
    return render(
      <CustomModal
        openDialog={true}
        handleCloseDialog={handleCloseMock}
        title="Test Modal"
        disableClose={false}
        icon={<CloseIcon />}
        isActionButtonRequired={true}
        isTitleRequired={true}
        actionButtons={<button>Action</button>}
        {...props}
      >
        <p>Modal Content</p>
      </CustomModal>
    );
  };

  test('renders modal with title and content', () => {
    renderModal();

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByLabelText('close')).toBeInTheDocument();
  });

  test('calls handleCloseDialog when the close icon is clicked', () => {
    renderModal();
    const closeButton = screen.getByLabelText('close');

    fireEvent.click(closeButton);
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  test('does not render title if isTitleRequired is false', () => {
    renderModal({ isTitleRequired: false });

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  test('renders action buttons if isActionButtonRequired is true', () => {
    renderModal();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  test('does not render action buttons if isActionButtonRequired is false', () => {
    renderModal({ isActionButtonRequired: false });

    expect(screen.queryByText('Action')).not.toBeInTheDocument();
  });
});

describe('FormHeader Component', () => {
  const onCloseMock = jest.fn();

  const renderFormHeader = (props = {}) => {
    return render(
      <FormHeader
        title="Header Title"
        onClose={onCloseMock}
        disableClose={false}
        icon={<CloseIcon />}
        {...props}
      />
    );
  };

  test('renders form header with title and icon', () => {
    renderFormHeader();
    expect(screen.getByText('Header Title')).toBeInTheDocument();
    expect(screen.getByLabelText('close')).toBeInTheDocument();
  });

  test('calls onClose when close icon is clicked', () => {
    renderFormHeader();
    const closeButton = screen.getByLabelText('close');

    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('disables close button when disableClose is true', () => {
    renderFormHeader({ disableClose: true });

    const closeButton = screen.getByLabelText('close');
    expect(closeButton).toHaveStyle('cursor: pointer;');
  });
});

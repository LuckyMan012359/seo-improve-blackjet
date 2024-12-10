import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
/**
 * A custom dialog component that can be used to create a modal dialog.
 *
 * @param {boolean} openDialog - Whether the dialog is open or not.
 * @param {function} handleCloseDialog - A callback function to close the dialog.
 * @param {string} title - The title of the dialog.
 * @param {boolean} disableClose - Whether the close button should be disabled or not.
 * @param {string} icon - The icon to be displayed next to the title.
 * @param {ReactNode} children - The content of the dialog.
 * @param {boolean} isActionButtonRequired - Whether action buttons are required or not.
 * @param {boolean} isTitleRequired - Whether the title is required or not.
 * @param {ReactNode} actionButtons - The action buttons to be displayed at the bottom of the dialog.
 * @param {Object} parentProps - The props to be passed to the parent component.
 * @returns {ReactNode} - The custom dialog component.
 */
const CustomModal = ({
  openDialog,
  handleCloseDialog,
  title,
  disableClose,
  icon,
  children,
  isActionButtonRequired = false,
  isTitleRequired = false,
  actionButtons,
  parentProps,
  ...props
}) => {
  return (
    <div >
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby='form-dialog-main'
        fullWidth={true}
        {...props}
      >
        {isTitleRequired && (
          <DialogTitle id='form-dialog-title' sx={{ p: 0, m: 0, ml: 2 }}>
            <FormHeader
              id={title}
              title={title}
              onClose={handleCloseDialog}
              disableClose={disableClose}
              icon={icon}
            />
          </DialogTitle>
        )}

        <DialogContent sx={{ m: 2, p: 0 }}>{children}</DialogContent>
        {isActionButtonRequired && <DialogActions sx={{ mb: 2 }}>{actionButtons}</DialogActions>}
      </Dialog>
    </div>
  );
};

export function FormHeader({
  id = 'close',
  title = 'Form Title',
  onClose = () => console.log('No callback function assigned'),
  disableClose = false,
  icon = '',
  typProps,
}) {
  return (
    <Stack direction={'row'} justifyContent='space-between' alignItems='center' px={1}>
      <Stack>
        <Typography
          component='h6'
          variant='h6'
          // color='primary'
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          {...typProps}
        >
          <Stack mr={1}>{icon}</Stack>
          <div>{title}</div>
        </Typography>
      </Stack>
      <Stack
        aria-label='close'
        id={id}
        onClick={onClose}
        size='large'
        // color='secondary'
        disabled={disableClose}
        sx={{ cursor: 'pointer', m: 1, mb: 0 }}
      >
        <CloseIcon />
      </Stack>
    </Stack>
  );
}

export default CustomModal;

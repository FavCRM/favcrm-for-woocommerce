import {
  Fragment,
} from '@wordpress/element';
import {
  useBlockProps,
} from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json'

registerBlockType(metadata, {
  edit: props => {
    const blockProps = useBlockProps();

    return (
      <Fragment>
        <div { ...blockProps }>
          <div>
            {__('Member Zone', 'favcrm-for-woocommerce')}
          </div>
        </div>
      </Fragment>
    )
  },
})

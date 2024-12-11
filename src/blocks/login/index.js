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
            <h1>{__('Member Login', 'favored')}</h1>
          </div>
        </div>
      </Fragment>
    )
  },
})

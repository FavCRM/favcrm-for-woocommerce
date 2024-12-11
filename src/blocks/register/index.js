import {
  Fragment,
} from '@wordpress/element';
import {
  useBlockProps,
} from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json'

registerBlockType(metadata, {
  edit: props => {
    const blockProps = useBlockProps();

    return (
      <Fragment>
        <div { ...blockProps }>
          <div>
            <h1>會員註冊</h1>
          </div>
        </div>
      </Fragment>
    )
  },
})

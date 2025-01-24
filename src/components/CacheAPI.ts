import { modal } from '../index';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { Success } from './common/Success';

const successTemplate = ensureElement<HTMLTemplateElement>('#success');

export const apiCache: Record<string, any> = {};

export function handleSuccess(res: any) {
  const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => {
      modal.close();
    },
  });
  modal.render({
    content: success.render({
      total: res.total,
    }),
  });
};
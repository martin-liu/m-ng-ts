import '../common/components/module.ts';
import RequireService from '../common/services/require.service.ts';

RequireService.requireFolder('../components', /^.*\.component\.ts$/igm)

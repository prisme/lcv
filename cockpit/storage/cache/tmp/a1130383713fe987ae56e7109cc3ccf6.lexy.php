<?php $app->start('header'); ?>

    <?php echo  $app->assets(['forms:assets/forms.js','forms:assets/js/index.js'], $app['cockpit/version']) ; ?>

<?php $app->end('header'); ?>

<div data-ng-controller="forms" ng-cloak>

    <nav class="uk-navbar uk-margin-large-bottom">
        <span class="uk-hidden-small uk-navbar-brand"><?php echo $app("i18n")->get('Forms'); ?></span>
        <div class="uk-hidden-small uk-navbar-content" data-ng-show="forms && forms.length">
            <form class="uk-form uk-margin-remove uk-display-inline-block">
                <div class="uk-form-icon">
                    <i class="uk-icon-filter"></i>
                    <input type="text" placeholder="<?php echo $app("i18n")->get('Filter by name...'); ?>" data-ng-model="filter">
                </div>
            </form>
        </div>
        <?php if ($app->module("auth")->hasaccess("Forms", 'manage.forms')) { ?>
        <ul class="uk-navbar-nav">
            <li><a href="<?php $app->route('/forms/form'); ?>" title="<?php echo $app("i18n")->get('Add form'); ?>" data-uk-tooltip="{pos:'right'}"><i class="uk-icon-plus-circle"></i></a></li>
        </ul>
        <?php } ?>
        <div class="uk-navbar-flip" data-ng-if="forms && forms.length">
            <div class="uk-navbar-content">
                <div class="uk-button-group">
                    <button class="uk-button" data-ng-class="mode=='list' ? 'uk-button-primary':''" data-ng-click="setListMode('list')" title="<?php echo $app("i18n")->get('List mode'); ?>" data-uk-tooltip="{pos:'bottom'}"><i class="uk-icon-th"></i></button>
                    <button class="uk-button" data-ng-class="mode=='table' ? 'uk-button-primary':''" data-ng-click="setListMode('table')" title="<?php echo $app("i18n")->get('Table mode'); ?>" data-uk-tooltip="{pos:'bottom'}"><i class="uk-icon-th-list"></i></button>
                </div>
            </div>
        </div>
    </nav>

    <div class="uk-grid uk-grid-small" data-uk-grid-match data-ng-if="forms && forms.length && mode=='list'">
        <div class="uk-width-1-1 uk-width-medium-1-3 uk-width-large-1-4 uk-grid-margin" data-ng-repeat="form in forms track by form._id" data-ng-show="matchName(form.name)">

            <div class="app-panel">

                <a class="uk-link-muted" href="<?php $app->route('/forms/entries'); ?>/{{ form._id }}"><strong>{{ form.name }}</strong></a>

                <div class="uk-margin">
                    <span class="uk-badge app-badge">{{ form.count }} <?php echo $app("i18n")->get('Entries'); ?></span>
                </div>

                <div class="app-panel-box docked-bottom">

                    <div class="uk-link" data-uk-dropdown="{mode:'click'}">
                        <i class="uk-icon-bars"></i>
                        <div class="uk-dropdown">
                            <ul class="uk-nav uk-nav-dropdown uk-nav-parent-icon">
                                <li><a href="<?php $app->route('/forms/entries'); ?>/{{ form._id }}"><i class="uk-icon-list"></i> <?php echo $app("i18n")->get('Show entries'); ?></a></li>
                                <?php if ($app->module("auth")->hasaccess("Forms", 'manage.forms')) { ?>
                                <li class="uk-nav-divider"></li>
                                <li><a href="<?php $app->route('/forms/form'); ?>/{{ form._id }}"><i class="uk-icon-pencil"></i> <?php echo $app("i18n")->get('Edit form'); ?></a></li>
                                <li class="uk-danger"><a data-ng-click="remove($index, form)" href="#"><i class="uk-icon-minus-circle"></i> <?php echo $app("i18n")->get('Delete form'); ?></a></li>
                                <?php } ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="app-panel" data-ng-if="forms && forms.length && mode=='table'">
        <table class="uk-table uk-table-striped" multiple-select="{model:forms}">
            <thead>
                <tr>
                    <th width="10"><input class="js-select-all" type="checkbox"></th>
                    <th width="60%"><?php echo $app("i18n")->get('Form'); ?></th>
                    <th width="10%"><?php echo $app("i18n")->get('Entries'); ?></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr class="js-multiple-select" data-ng-repeat="form in forms track by form._id" data-ng-show="matchName(form.name)">
                    <td><input class="js-select" type="checkbox"></td>
                    <td>
                        <a href="<?php $app->route('/forms/entries'); ?>/{{ form._id }}">{{ form.name }}</a>
                    </td>
                    <td>{{ form.count }}</td>
                    <td>
                        <div class="uk-link uk-float-right" data-uk-dropdown>
                            <i class="uk-icon-bars"></i>
                            <div class="uk-dropdown">
                                <ul class="uk-nav uk-nav-dropdown uk-nav-parent-icon">
                                    <li><a href="<?php $app->route('/forms/entries'); ?>/{{ form._id }}"><i class="uk-icon-list"></i> <?php echo $app("i18n")->get('Show entries'); ?></a></li>
                                    <?php if ($app->module("auth")->hasaccess("Forms", 'manage.forms')) { ?>
                                    <li class="uk-nav-divider"></li>
                                    <li><a href="<?php $app->route('/forms/form'); ?>/{{ form._id }}"><i class="uk-icon-pencil"></i> <?php echo $app("i18n")->get('Edit form'); ?></a></li>
                                    <li class="uk-danger"><a data-ng-click="remove($index, form)" href="#"><i class="uk-icon-minus-circle"></i> <?php echo $app("i18n")->get('Delete form'); ?></a></li>
                                    <?php } ?>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="uk-margin-top">
            <button class="uk-button uk-button-danger" data-ng-click="removeSelected()" data-ng-show="selected"><i class="uk-icon-trash-o"></i> <?php echo $app("i18n")->get('Delete'); ?></button>
        </div>
    </div>

    <div class="uk-text-center app-panel" data-ng-show="forms && !forms.length">
        <h2><i class="uk-icon-inbox"></i></h2>
        <p class="uk-text-large">
            <?php echo $app("i18n")->get('You don\'t have any forms created.'); ?>
        </p>

        <?php if ($app->module("auth")->hasaccess("Forms", 'manage.forms')) { ?>
        <a href="<?php $app->route('/forms/form'); ?>" class="uk-button uk-button-success uk-button-large"><?php echo $app("i18n")->get('Create a form'); ?></a>
        <?php } ?>
    </div>

</div>
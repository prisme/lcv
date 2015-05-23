<?php $app->start('header'); ?>

    <?php echo  $app->assets(['forms:assets/forms.js','forms:assets/js/entries.js'], $app['cockpit/version']) ; ?>

    <style>
        td .uk-grid+.uk-grid { margin-top: 5px; }
    </style>

    <script>
        var FORMDATA = <?php echo  json_encode($form) ; ?>;
    </script>

<?php $app->end('header'); ?>


<div data-ng-controller="entries" ng-cloak>

    <nav class="uk-navbar uk-margin-bottom">
        <span class="uk-navbar-brand"><a href="<?php $app->route("/forms"); ?>"><?php echo $app("i18n")->get('Forms'); ?></a> / <?php echo  $form['name'] ; ?></span>
        <?php if ($app->module("auth")->hasaccess("Forms", 'manage.forms')) { ?>
        <ul class="uk-navbar-nav">
            <li><a href="<?php $app->route('/forms/form/'.$form["_id"]); ?>" title="<?php echo $app("i18n")->get('Edit form'); ?>" data-uk-tooltip="{pos:'bottom'}"><i class="uk-icon-pencil"></i></a></li>
            <li><a class="uk-text-danger" ng-click="emptytable()" title="<?php echo $app("i18n")->get('Empty table'); ?>" data-uk-tooltip="{pos:'bottom'}"><i class="uk-icon-trash-o"></i></a></li>
        </ul>
        <?php } ?>

        <div class="uk-navbar-flip">
            <?php if ($app->module("auth")->hasaccess("Forms", 'manage.forms')) { ?>
            <div class="uk-navbar-content" data-ng-show="entries && entries.length">
                <a class="uk-button" href="<?php $app->route('/api/forms/export/'.$form['_id']); ?>" download="<?php echo  $form['name'] ; ?>.json" title="<?php echo $app("i18n")->get('Export data'); ?>" data-uk-tooltip="{pos:'bottom'}">
                    <i class="uk-icon-share-alt"></i>
                </a>
            </div>
            <?php } ?>
        </div>
    </nav>

    <div class="app-panel uk-margin uk-text-center" data-ng-show="entries && !entries.length">
        <h2><i class="uk-icon-inbox"></i></h2>
        <p class="uk-text-large">
            <?php echo $app("i18n")->get('It seems you don\'t have any form entries.'); ?>
        </p>
    </div>

    <div class="uk-grid" data-uk-grid-margin data-ng-show="entries && entries.length">

        <div class="uk-width-medium-1-1">
            <div class="app-panel">
                <table class="uk-table uk-table-striped" multiple-select="{model:entries}">
                    <thead>
                        <tr>
                            <th width="10"><input class="js-select-all" type="checkbox"></th>
                            <th>
                                <?php echo $app("i18n")->get('Form data'); ?>
                            </th>
                            <th width="20%"><?php echo $app("i18n")->get('Created'); ?></th>
                            <th width="5%">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="js-multiple-select" data-ng-repeat="entry in entries track by entry._id">
                            <td><input class="js-select" type="checkbox"></td>
                            <td>
                                <div class="uk-grid uk-grid-preserve uk-text-small" data-ng-repeat="(key, value) in entry.data">
                                    <div class="uk-width-medium-1-5">
                                        <strong>{{ key }}</strong>
                                    </div>
                                    <div class="uk-width-medium-4-5">
                                        {{ value }}
                                    </div>
                                </div>
                            </td>
                            <td>{{ entry.created | fmtdate:'d M, Y H:i' }}</td>
                            <td class="uk-text-right">
                                <a href="#" data-ng-click="remove($index, entry._id)" title="<?php echo $app("i18n")->get('Delete entry'); ?>"><i class="uk-icon-trash-o"></i></a>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="uk-margin-top">
                    <button class="uk-button uk-button-primary" data-ng-click="loadmore()" data-ng-show="entries && !nomore"><?php echo $app("i18n")->get('Load more...'); ?></button>
                    <button class="uk-button uk-button-danger" data-ng-click="removeSelected()" data-ng-show="selected"><i class="uk-icon-trash-o"></i> <?php echo $app("i18n")->get('Delete entries'); ?></button>
                </div>

            </div>
        </div>
    </div>
</div>